import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import createMiddleEllipsisUtils from "./core/index";

/**
 * Lit web component for dynamic text truncation.
 *
 * @slot - Default slot for text content to be truncated
 *
 * @attr {string} tooltip - Custom tooltip text. If not provided, defaults to
 *   the full un-truncated text content.
 *
 * @csspart ellipsis - The ellipsis symbol element, allowing custom styling
 *   for positioning, color, font, etc. Useful for adjusting vertical alignment
 *   of special characters or adding visual emphasis.
 *
 * @remarks
 * This component uses IntersectionObserver to defer truncation calculations
 * until the element is visible in the viewport. This provides excellent
 * performance for large lists and tables with hundreds of truncated items.
 *
 * The `tooltip` attribute is automatically set to the full text content unless
 * explicitly provided by the user. This enables native browser tooltips on hover.
 *
 * @example Basic usage
 * ```html
 * <text-truncate>
 *   This is a very long text that will be truncated in the middle
 * </text-truncate>
 * ```
 *
 * @example Custom ellipsis symbol with multi-line support
 * ```html
 * <text-truncate ellipsis-symbol="[...]" line-limit="2">
 *   Multi-line text with custom ellipsis
 * </text-truncate>
 * ```
 *
 * @example Custom tooltip text
 * ```html
 * <text-truncate tooltip="Click to view full path">
 *   /Users/johndoe/documents/very-long-file-path.txt
 * </text-truncate>
 * ```
 *
 * @example Styling the ellipsis symbol
 * ```css
 * text-truncate::part(ellipsis) {
 *   position: relative;
 *   top: -2px;
 *   color: #666;
 * }
 * ```
 */
@customElement("text-truncate")
export class TextTruncate extends LitElement {
	static styles = css`
		:host {
			display: block;
			max-width: 100%;
			box-sizing: border-box;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		}
		
		.content {
			white-space: nowrap;
			overflow: hidden;
			line-height: 1.2;
		}
		
		.content.multiline {
			white-space: normal;
			word-wrap: break-word;
			overflow: hidden;
			display: block;
		}

		.content.end-mode {
			text-overflow: ellipsis;
		}

		.content.end-mode.multiline {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		/* Default ellipsis styles - can be overridden via ::part(ellipsis) */
		[part="ellipsis"] {
			display: inline;
			vertical-align: baseline;
		}
	`;

	/**
	 * Determines the truncation variant to use.
	 * - "middle": Truncates text in the middle with an ellipsis.
	 * - "end": Truncates text at the end using CSS text-overflow.
	 *
	 * @default "middle"
	 */
	@property({ type: String })
	variant: "middle" | "end" = "middle";

	/**
	 * Symbol to use for the ellipsis when truncating text.
	 *
	 * @default "…"
	 */
	@property({ type: String, attribute: "ellipsis-symbol" })
	ellipsisSymbol = "…";

	/**
	 * Number of lines to display before truncating.
	 * Supports multi-line truncation.
	 *
	 * @default 1
	 */
	@property({ type: Number, attribute: "line-limit" })
	lineLimit = 1;

	/**
	 * Custom tooltip text to show on hover.
	 * If not provided, defaults to the full un-truncated text content.
	 */
	@property({ type: String, attribute: "tooltip", reflect: true })
	tooltip = "";

	@query(".content")
	private contentElement!: HTMLDivElement;

	private cleanupTruncate?: () => void;
	private slotContent = "";
	private slotObserver?: MutationObserver;
	private intersectionObserver?: IntersectionObserver;
	private hasBeenVisible = false;
	private pendingTruncation = false;

	disconnectedCallback() {
		super.disconnectedCallback();
		this.cleanupTruncate?.();
		this.slotObserver?.disconnect();
		this.intersectionObserver?.disconnect();
	}

	private handleSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement;
		const nodes = slot.assignedNodes({ flatten: true });
		const newContent = nodes
			.map((node) => node.textContent || "")
			.join("")
			.trim();

		// Only update if content actually changed
		if (newContent !== this.slotContent) {
			this.slotContent = newContent;
			// Set tooltip to full text if not explicitly provided by user
			if (!this.hasAttribute("tooltip") || this.tooltip === "") {
				this.tooltip = newContent;
			}
			this.cleanupTruncate?.();
			this.setupTruncation();
		}

		// Set up observer for text node changes
		this.slotObserver?.disconnect();
		this.slotObserver = new MutationObserver(() => {
			const updatedContent = nodes
				.map((node) => node.textContent || "")
				.join("")
				.trim();
			if (updatedContent !== this.slotContent) {
				this.slotContent = updatedContent;
				// Update tooltip to full text if not explicitly provided by user
				if (!this.hasAttribute("tooltip") || this.tooltip === "") {
					this.tooltip = updatedContent;
				}
				this.cleanupTruncate?.();
				this.setupTruncation();
			}
		});

		// Observe all text nodes
		for (const node of nodes) {
			if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
				this.slotObserver.observe(node.parentNode, {
					characterData: true,
					childList: true,
					subtree: true,
				});
			}
		}
	}

	private setupTruncation() {
		if (!this.contentElement || !this.slotContent) return;

		// If not yet visible, defer truncation until element becomes visible
		// This dramatically improves performance for large lists/tables
		if (!this.hasBeenVisible) {
			this.pendingTruncation = true;
			this.setupIntersectionObserver();
			// Show original text with CSS overflow as placeholder
			this.contentElement.textContent = this.slotContent;
			return;
		}

		this.pendingTruncation = false;

		// Set max-height for multiline
		if (this.lineLimit > 1) {
			const computedStyle = window.getComputedStyle(this.contentElement);
			let lineHeight = parseFloat(computedStyle.lineHeight);

			// If lineHeight is "normal" or NaN, calculate it from fontSize
			if (Number.isNaN(lineHeight)) {
				const fontSize = parseFloat(computedStyle.fontSize);
				lineHeight = fontSize * 1.2; // Typical "normal" line-height
			}

			const maxHeight = lineHeight * this.lineLimit;
			this.contentElement.style.maxHeight = `${maxHeight}px`;

			// For end mode, use -webkit-line-clamp
			if (this.variant === "end") {
				this.contentElement.style.webkitLineClamp = String(this.lineLimit);
			} else {
				this.contentElement.style.webkitLineClamp = "";
			}
		} else {
			this.contentElement.style.maxHeight = "";
			this.contentElement.style.webkitLineClamp = "";
		}

		if (this.variant === "end") {
			this.setupEndTruncation();
		} else {
			this.setupMiddleTruncation();
		}
	}

	private setupEndTruncation() {
		// For end mode, just set the text and let CSS handle truncation
		this.contentElement.textContent = this.slotContent;
	}

	private setupIntersectionObserver() {
		// Already observing or already been visible
		if (this.intersectionObserver || this.hasBeenVisible) return;

		this.intersectionObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						this.hasBeenVisible = true;
						this.intersectionObserver?.disconnect();
						this.intersectionObserver = undefined;

						// Now run the actual truncation if pending
						if (this.pendingTruncation) {
							requestAnimationFrame(() => {
								this.setupTruncation();
							});
						}
						break;
					}
				}
			},
			{
				// Start truncating slightly before element enters viewport
				rootMargin: "100px",
			},
		);

		this.intersectionObserver.observe(this);
	}

	private setupMiddleTruncation() {
		const truncateOnResize = createMiddleEllipsisUtils();

		// For multiline middle mode, we need to check scrollHeight vs clientHeight
		// instead of just scrollWidth vs clientWidth
		this.cleanupTruncate = truncateOnResize({
			boundingElement: this as unknown as HTMLElement,
			targetElement: this.contentElement,
			originalText: this.slotContent,
			ellipsisSymbol: this.ellipsisSymbol,
			lineLimit: this.lineLimit,
		});
	}

	protected firstUpdated() {
		// Check if element is already visible in viewport
		// If so, truncate immediately to avoid visual jump
		const rect = this.getBoundingClientRect();
		const isInViewport =
			rect.top < window.innerHeight + 100 &&
			rect.bottom > -100 &&
			rect.left < window.innerWidth + 100 &&
			rect.right > -100;

		if (isInViewport) {
			this.hasBeenVisible = true;
		}

		// Use requestAnimationFrame to ensure DOM is fully rendered with correct widths
		requestAnimationFrame(() => {
			this.setupTruncation();
		});
	}

	protected updated(changedProperties: Map<string, unknown>) {
		// Check if any properties that affect truncation have changed
		const shouldRetruncate =
			changedProperties.has("ellipsisSymbol") ||
			changedProperties.has("lineLimit") ||
			changedProperties.has("variant");

		if (shouldRetruncate) {
			this.cleanupTruncate?.();
			this.setupTruncation();
		}

		// Also re-check slot content in case it changed without firing slotchange
		if (changedProperties.size > 0) {
			requestAnimationFrame(() => {
				const slot = this.shadowRoot?.querySelector("slot") as HTMLSlotElement;
				if (slot) {
					const nodes = slot.assignedNodes({ flatten: true });
					const newContent = nodes
						.map((node) => node.textContent || "")
						.join("")
						.trim();
					if (newContent && newContent !== this.slotContent) {
						this.slotContent = newContent;
						this.cleanupTruncate?.();
						this.setupTruncation();
					}
				}
			});
		}
	}

	render() {
		const isMultiline = this.lineLimit > 1;
		const isEndMode = this.variant === "end";

		// Build class list
		const classList = ["content"];
		if (isMultiline) {
			classList.push("multiline");
		}
		if (isEndMode) {
			classList.push("end-mode");
		}
		const classes = classList.join(" ");

		return html`
			<div class=${classes}></div>
			<slot @slotchange=${this.handleSlotChange} style="display: none;"></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"text-truncate": TextTruncate;
	}
}
