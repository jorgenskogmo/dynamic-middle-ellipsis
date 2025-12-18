import createMiddleEllipsisUtils, {
	type MiddleEllipsisConfig,
} from "@dynamic-middle-ellipsis/core";
import { html, LitElement, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Lit web component for dynamic middle ellipsis text truncation.
 *
 * @slot - Default slot for text content to be truncated
 *
 * @example
 * ```html
 * <middle-ellipsis>
 *   This is a very long text that will be truncated in the middle
 * </middle-ellipsis>
 * ```
 *
 * @example
 * ```html
 * <middle-ellipsis ellipsis-symbol="[...]" line-limit="2">
 *   Multi-line text with custom ellipsis
 * </middle-ellipsis>
 * ```
 */
@customElement("middle-ellipsis")
export class MiddleEllipsis extends LitElement {
	/**
	 * Custom ellipsis symbol to display in the middle of truncated text
	 * @default "..."
	 */
	@property({ attribute: "ellipsis-symbol", type: String })
	ellipsisSymbol = "...";

	/**
	 * Number of lines to allow before truncating
	 * @default 1
	 */
	@property({ attribute: "line-limit", type: Number })
	lineLimit = 1;

	/**
	 * Configuration for custom font width mapping
	 */
	config?: MiddleEllipsisConfig;

	private truncateOnResize = createMiddleEllipsisUtils(this.config);
	private cleanup?: () => void;
	private spanElement?: HTMLSpanElement;
	private originalText = "";

	// Disable shadow DOM to allow proper text measurement
	protected createRenderRoot() {
		return this;
	}

	connectedCallback(): void {
		super.connectedCallback();
		// Capture the original text content from the slot before rendering
		this.originalText = this.textContent?.trim() || "";
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties);
		this.setupTruncation();
	}

	protected updated(changedProperties: PropertyValues): void {
		super.updated(changedProperties);

		// Re-setup truncation if relevant properties changed
		if (
			changedProperties.has("ellipsisSymbol") ||
			changedProperties.has("lineLimit")
		) {
			this.setupTruncation();
		}
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.cleanup?.();
	}

	private setupTruncation(): void {
		// Clean up previous observer
		this.cleanup?.();

		// Find the span element we rendered
		this.spanElement = this.querySelector("span") as HTMLSpanElement;
		if (!this.spanElement) return;

		// Setup truncation with the original text
		this.cleanup = this.truncateOnResize({
			targetElement: this.spanElement,
			originalText: this.originalText,
			ellipsisSymbol: this.ellipsisSymbol,
			lineLimit: this.lineLimit,
		});
	}

	protected render() {
		return html`<span
			style="word-break: break-all;"
			aria-label="${this.originalText}"
			>\u00A0</span
		>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"middle-ellipsis": MiddleEllipsis;
	}
}
