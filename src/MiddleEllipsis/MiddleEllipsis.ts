import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import createMiddleEllipsisUtils from "./core/index";

/**
 * Lit web component for dynamic middle ellipsis text truncation.
 *
 * @slot - Default slot for text content to be truncated
 *
 * @example Basic usage
 * ```html
 * <middle-ellipsis>
 *   This is a very long text that will be truncated in the middle
 * </middle-ellipsis>
 * ```
 *
 * @example Custom ellipsis symbol with multi-line support
 * ```html
 * <middle-ellipsis ellipsis-symbol="[...]" line-limit="2">
 *   Multi-line text with custom ellipsis
 * </middle-ellipsis>
 * ```
 */
@customElement("middle-ellipsis")
export class MiddleEllipsis extends LitElement {
	static styles = css`
		:host {
			display: block;
			max-width: 100%;
			box-sizing: border-box;
		}
		
		.content {
			white-space: nowrap;
			overflow: hidden;
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
	`;

	@property({ type: String })
	variant: "middle" | "end" = "middle";

	@property({ type: String, attribute: "ellipsis-symbol" })
	ellipsisSymbol = "…";

	@property({ type: Number, attribute: "line-limit" })
	lineLimit = 1;

	@query(".content")
	private contentElement!: HTMLDivElement;

	private cleanupTruncate?: () => void;
	private slotContent = "";

	disconnectedCallback() {
		super.disconnectedCallback();
		this.cleanupTruncate?.();
	}

	private handleSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement;
		const nodes = slot.assignedNodes({ flatten: true });
		this.slotContent = nodes
			.map((node) => node.textContent || "")
			.join("")
			.trim();
		this.cleanupTruncate?.();
		this.setupTruncation();
	}

	private setupTruncation() {
		if (!this.contentElement || !this.slotContent) return;

		// Set max-height for multiline
		if (this.lineLimit > 1) {
			const computedStyle = window.getComputedStyle(this.contentElement);
			let lineHeight = parseFloat(computedStyle.lineHeight);

			// If lineHeight is "normal" or NaN, calculate it from fontSize
			if (isNaN(lineHeight)) {
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
		// Use requestAnimationFrame to ensure DOM is fully rendered with correct widths
		requestAnimationFrame(() => {
			this.setupTruncation();
		});
	}

	protected updated(changedProperties: Map<string, unknown>) {
		if (
			changedProperties.has("ellipsisSymbol") ||
			changedProperties.has("lineLimit") ||
			changedProperties.has("variant")
		) {
			this.cleanupTruncate?.();
			this.setupTruncation();
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
		"middle-ellipsis": MiddleEllipsis;
	}
}
