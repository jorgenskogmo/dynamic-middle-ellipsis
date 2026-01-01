import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import "./TextTruncate";

interface TextTruncateArgs {
	variant: "middle" | "end";
	ellipsisSymbol: string;
	lineLimit: number;
	text: string;
	tooltip?: string;
}

// Helper function to render text-truncate with full text preview
const renderWithPreview = (args: TextTruncateArgs) => html`
	<div style="background: #0f03; ">
        <text-truncate
            .variant=${args.variant}
            .ellipsisSymbol=${args.ellipsisSymbol}
            .lineLimit=${args.lineLimit}
        >
            ${args.text}
        </text-truncate>
    </div>
	<div style="margin-top: 1rem; background: #e8e8e8; font-family: system-ui;">
		${args.text}
	</div>
`;

const meta = {
	title: "Components/TextTruncate",
	component: "text-truncate",
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["middle", "end"],
			description: "Truncation mode: middle or end",
			table: {
				defaultValue: { summary: "middle" },
			},
		},
		ellipsisSymbol: {
			control: { type: "text" },
			description: "Custom ellipsis symbol to use for truncation",
			table: {
				defaultValue: { summary: "…" },
			},
		},
		lineLimit: {
			control: { type: "number", min: 1, max: 10 },
			description: "Maximum number of lines before truncation",
			table: {
				defaultValue: { summary: "1" },
			},
		},
		text: {
			control: { type: "text" },
			description:
				"Text content to truncate (optional, for Default story only)",
		},
		tooltip: {
			control: { type: "text" },
			description:
				"Custom tooltip text. If not provided, defaults to the full un-truncated text.",
			table: {
				defaultValue: { summary: "(full text)" },
			},
		},
	},
	decorators: [
		(story, context) => {
			// Ensure text arg is always available
			if (!context.args.text) {
				context.args.text = "";
			}
			return story();
		},
	],
} satisfies Meta;

export default meta;
type Story = StoryObj<TextTruncateArgs>;

export const Default: Story = {
	args: {
		// variant: "middle",
		// ellipsisSymbol: "[…]",
		// lineLimit: 1,
		text: "This is a very long text that will be truncated in the middle when the container is not wide enough to display it all",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const CustomEllipsisSymbol: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "[...]",
		lineLimit: 1,
		text: "/home/user/documents/projects/my-awesome-project/src/components/MiddleEllipsis/implementation/v2/final.tsx",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const TripleDots: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "...",
		lineLimit: 1,
		text: "Product Name: Ultra Premium Wireless Noise Cancelling Headphones with Advanced Sound Technology",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const CustomTooltip: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "…",
		lineLimit: 1,
		text: "/Users/johndoe/documents/projects/my-awesome-project/src/components/feature.tsx",
		tooltip: "Click to open file in editor",
	},
	render: (args: TextTruncateArgs) => html`
		<p style="margin-bottom: 1rem; font-family: system-ui; color: #666;">
			Hover over the truncated text to see the custom tooltip.
			By default, the tooltip shows the full text, but you can override it.
		</p>
		<div style="background: #0f03;">
			<text-truncate
				.variant=${args.variant}
				.ellipsisSymbol=${args.ellipsisSymbol}
				.lineLimit=${args.lineLimit}
				tooltip=${ifDefined(args.tooltip)}
			>
				${args.text}
			</text-truncate>
		</div>
		<div style="margin-top: 1rem; background: #e8e8e8; font-family: system-ui;">
			<strong>Full text:</strong> ${args.text}
		</div>
		<div style="margin-top: 0.5rem; background: #e8f4e8; font-family: system-ui; padding: 4px;">
			<strong>Custom tooltip:</strong> ${args.tooltip}
		</div>
	`,
};

export const ArrowSymbol: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: " ⟷ ",
		lineLimit: 1,
		text: "user@example.com/documents/work/presentations/q4-2024/sales-report-final-reviewed-approved.pdf",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const ArrowSymbolStyled: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: " ⟷ ",
		lineLimit: 1,
		text: "user@example.com/documents/work/presentations/q4-2024/sales-report-final-reviewed-approved.pdf",
	},
	render: (args: TextTruncateArgs) => html`
		<style>
			text-truncate.styled-arrow::part(ellipsis) {
				position: relative;
				top: -2px;
				color: #f00;
			}
		</style>
		<div style="background: #0f03;">
			<text-truncate
				class="styled-arrow"
				.variant=${args.variant}
				.ellipsisSymbol=${args.ellipsisSymbol}
				.lineLimit=${args.lineLimit}
			>
				${args.text}
			</text-truncate>
		</div>
		<div style="margin-top: 1rem; background: #e8e8e8; font-family: system-ui;">
			${args.text}
		</div>
		<p style="margin-top: 1rem; font-size: 12px; color: #666;">
			The ellipsis is styled using <code>::part(ellipsis)</code> to adjust vertical position and color.
		</p>
	`,
};

export const EmojiSymbol: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: " 🔗 ",
		lineLimit: 1,
		text: "https://www.example.com/api/v1/users/12345/profile/settings/notifications/preferences/email",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const MultiLineTwoLines: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "…",
		lineLimit: 2,
		text: "This is a much longer piece of text that demonstrates the multi-line truncation feature. The text will wrap to multiple lines and still truncate in the middle when it exceeds the specified line limit. This is particularly useful for displaying long descriptions or file paths in a user interface.",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const MultiLineThreeLines: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: " [...] ",
		lineLimit: 3,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const NarrowContainer: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "…",
		lineLimit: 1,
		text: "SuperLongFileNameWithoutSpaces_v2_final_FINAL_approved.docx",
	},
	decorators: [
		(story) => html`
			<div style="width: 25%;">
				${story()}
			</div>
		`,
	],
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const EndTruncationSingleLine: Story = {
	args: {
		variant: "end",
		ellipsisSymbol: "…",
		lineLimit: 1,
		text: "This is a very long text that will be truncated at the end when the container is not wide enough to display it all",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const EndTruncationCustomSymbol: Story = {
	args: {
		variant: "end",
		ellipsisSymbol: "...",
		lineLimit: 1,
		text: "/home/user/documents/projects/my-awesome-project/src/components/MiddleEllipsis/implementation/v2/final.tsx",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const EndTruncationMultiLine: Story = {
	args: {
		variant: "end",
		ellipsisSymbol: "…",
		lineLimit: 2,
		text: "This is a much longer piece of text that demonstrates the multi-line end truncation feature. The text will wrap to multiple lines and truncate at the end when it exceeds the specified line limit. This is particularly useful for displaying long descriptions or article previews in a user interface.",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const EndTruncationReadMore: Story = {
	args: {
		variant: "end",
		ellipsisSymbol: " [read more]",
		lineLimit: 3,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

// Real-World Use Cases
export const FilePathMiddle: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "...",
		lineLimit: 1,
		text: "C:\\Users\\JohnDoe\\AppData\\Local\\Programs\\MyApplication\\resources\\assets\\images\\icons\\png\\high-res\\logo-2024.png",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const FilePathEnd: Story = {
	args: {
		variant: "end",
		ellipsisSymbol: "...",
		lineLimit: 1,
		text: "C:\\Users\\JohnDoe\\AppData\\Local\\Programs\\MyApplication\\resources\\assets\\images\\icons\\png\\high-res\\logo-2024.png",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const EmailAddress: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "…",
		lineLimit: 1,
		text: "john.doe.developer.extraordinaire@my-super-long-company-name-inc.com",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const URL: Story = {
	args: {
		variant: "end",
		ellipsisSymbol: "…",
		lineLimit: 1,
		text: "https://www.example-ecommerce-store.com/products/electronics/computers/laptops/gaming/high-performance/rtx-4090?color=black&size=15inch&storage=2tb",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const ProductDescriptionMiddle: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: " … ",
		lineLimit: 2,
		text: "Premium Organic Extra Virgin Olive Oil from Certified Sustainable Farms in the Mediterranean Region - Cold Pressed, Non-GMO, Rich in Antioxidants - Perfect for Cooking and Salads - 500ml Glass Bottle",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

export const ProductDescriptionEnd: Story = {
	args: {
		variant: "end",
		ellipsisSymbol: "…",
		lineLimit: 2,
		text: "Premium Organic Extra Virgin Olive Oil from Certified Sustainable Farms in the Mediterranean Region - Cold Pressed, Non-GMO, Rich in Antioxidants - Perfect for Cooking and Salads - 500ml Glass Bottle",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
};

// Generate sample file paths for the table
const generateFilePaths = (count: number) => {
	const folders = [
		"documents",
		"projects",
		"downloads",
		"images",
		"videos",
		"music",
		"archives",
		"backups",
	];
	const subfolders = [
		"2024",
		"2025",
		"work",
		"personal",
		"shared",
		"temp",
		"important",
		"archive",
	];
	const fileTypes = [
		{ ext: "pdf", names: ["report", "invoice", "contract", "manual", "guide"] },
		{
			ext: "docx",
			names: ["proposal", "notes", "summary", "draft", "final-version"],
		},
		{
			ext: "xlsx",
			names: ["budget", "analytics", "data-export", "inventory", "schedule"],
		},
		{
			ext: "png",
			names: ["screenshot", "design-mockup", "logo", "banner", "thumbnail"],
		},
		{
			ext: "zip",
			names: ["backup", "project-files", "assets", "source-code", "release"],
		},
	];

	const paths: string[] = [];
	for (let i = 0; i < count; i++) {
		const folder = folders[i % folders.length];
		const subfolder =
			subfolders[Math.floor(i / folders.length) % subfolders.length];
		const fileType = fileTypes[i % fileTypes.length];
		const fileName =
			fileType.names[Math.floor(i / fileTypes.length) % fileType.names.length];
		const suffix = `-v${(i % 5) + 1}-final-reviewed-approved-${Date.now() - i * 100000}`;
		paths.push(
			`/Users/johndoe/${folder}/${subfolder}/projects/client-${Math.floor(i / 10) + 1}/${fileName}${suffix}.${fileType.ext}`,
		);
	}
	return paths;
};

const tableFilePaths = generateFilePaths(200);

export const TableWith200Rows: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: "…",
		lineLimit: 1,
		text: "",
	},
	render: (args: TextTruncateArgs) => html`
		<style>
			.demo-table {
				width: 100%;
				table-layout: fixed;
				border-collapse: collapse;
				font-family: system-ui, sans-serif;
				font-size: 14px;
			}
			.demo-table th,
			.demo-table td {
				border: 1px solid #ddd;
				padding: 8px;
				text-align: left;
				overflow: hidden;
			}
			.demo-table th {
				background: #f5f5f5;
				font-weight: 600;
				position: sticky;
				top: 0;
			}
			.demo-table tr:nth-child(even) {
				background: #fafafa;
			}
			.demo-table tr:hover {
				background: #f0f0f0;
			}
			/* Fixed width columns */
			.demo-table th:nth-child(1),
			.demo-table td:nth-child(1) {
				width: 50px;
				text-align: center;
				color: #888;
			}
			.demo-table th:nth-child(3),
			.demo-table td:nth-child(3) {
				width: 80px;
				text-align: right;
				white-space: nowrap;
			}
			.demo-table th:nth-child(4),
			.demo-table td:nth-child(4) {
				width: 100px;
				white-space: nowrap;
			}
			/* File path column takes remaining space */
			.demo-table th:nth-child(2),
			.demo-table td:nth-child(2) {
				width: auto;
			}
			.table-container {
				width: 100%;
				/* max-height: 600px;
				overflow: auto; */
				border: 1px solid #ddd;
				border-radius: 4px;
			}
		</style>
		<p style="margin-bottom: 1rem; font-family: system-ui; color: #666;">
			Table with 200 rows using middle truncation for file paths. Resize the
			window to see dynamic re-truncation.
		</p>
		<div class="table-container">
			<table class="demo-table">
				<thead>
					<tr>
						<th>#</th>
						<th>File Path</th>
						<th>Size</th>
						<th>Modified</th>
					</tr>
				</thead>
				<tbody>
					${tableFilePaths.map(
						(path, i) => html`
							<tr>
								<td>${i + 1}</td>
								<td>
									<text-truncate variant=${args.variant} ellipsis-symbol=${args.ellipsisSymbol}>
										${path}
									</text-truncate>
								</td>
								<td>${Math.floor(Math.random() * 9999) + 1} KB</td>
								<td>${new Date(Date.now() - i * 86400000).toLocaleDateString()}</td>
							</tr>
						`,
					)}
				</tbody>
			</table>
		</div>
	`,
};
