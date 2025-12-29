import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { generateCharacterWidthMapping } from "./core/font-width-generator";
import createMiddleEllipsisUtils from "./core/index";
import {
	disableDebugMode,
	enableDebugMode,
	setForceCanvasMode,
} from "./core/string-utils";

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
 *
 * @example Debug mode to generate font width mappings
 * ```html
 * <middle-ellipsis debug-font-mapping>
 *   Text to analyze font mapping
 * </middle-ellipsis>
 * ```
 *
 * @example Force Canvas mode for pixel-perfect measurements
 * ```html
 * <middle-ellipsis force-canvas>
 *   Use Canvas measureText for pixel-perfect accuracy
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
		}
	`;

	@property({ type: String, attribute: "ellipsis-symbol" })
	ellipsisSymbol = "…";

	@property({ type: Number, attribute: "line-limit" })
	lineLimit = 1;

	@property({ type: Boolean, attribute: "debug-font-mapping" })
	debugFontMapping = false;

	@property({ type: Boolean, attribute: "force-canvas" })
	forceCanvas = false;

	@query(".content")
	private contentElement!: HTMLDivElement;

	private cleanupTruncate?: () => void;
	private slotContent = "";

	connectedCallback() {
		super.connectedCallback();
	}

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

		const style = window.getComputedStyle(this.contentElement);
		const fontFamily = style.fontFamily.split(",")[0];
		const fontSize = style.fontSize;

		setForceCanvasMode(this.forceCanvas);

		if (this.debugFontMapping) {
			console.group(`🔍 Font Mapping Debug - <middle-ellipsis>`);
			console.log(`Font Family: ${fontFamily}`);
			console.log(`Font Size: ${fontSize}`);
			console.log(`Text: "${this.slotContent}"`);
			console.log(`Force Canvas Mode: ${this.forceCanvas}`);

			try {
				const mapping = generateCharacterWidthMapping(fontFamily);
				console.log(`\nCharacter Width Mapping for ${fontFamily}:`);
				console.log(JSON.stringify(mapping, null, 2));
				console.log(`\nAdd this to default-font-width-map.ts:`);
				console.log(`"${fontFamily}": ${JSON.stringify(mapping, null, 2)},`);
			} catch (error) {
				console.error("Failed to generate font mapping:", error);
			}

			enableDebugMode(fontFamily);
		}

		const truncateOnResize = createMiddleEllipsisUtils();

		this.cleanupTruncate = truncateOnResize({
			boundingElement: this as unknown as HTMLElement,
			targetElement: this.contentElement,
			originalText: this.slotContent,
			ellipsisSymbol: this.ellipsisSymbol,
			lineLimit: this.lineLimit,
		});
		if (this.debugFontMapping) {
			disableDebugMode();
			console.groupEnd();
		}
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
			changedProperties.has("debugFontMapping") ||
			changedProperties.has("forceCanvas")
		) {
			this.cleanupTruncate?.();
			this.setupTruncation();
		}
	}

	render() {
		const classes = this.lineLimit > 1 ? "content multiline" : "content";
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
