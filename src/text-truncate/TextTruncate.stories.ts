import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./TextTruncate";

interface TextTruncateArgs {
	variant: "middle" | "end";
	ellipsisSymbol: string;
	lineLimit: number;
	text: string;
}

// Helper function to render text-truncate with full text preview
const renderWithPreview = (args: TextTruncateArgs) => html`
	<div style="background: #0f03;">
        <text-truncate
            .variant=${args.variant}
            .ellipsisSymbol=${args.ellipsisSymbol}
            .lineLimit=${args.lineLimit}
        >
            ${args.text}
        </text-truncate>
    </div>
	<div style="margin-top: 1rem; background: #e8e8e8;">
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
		variant: "middle",
		ellipsisSymbol: "[…]",
		lineLimit: 1,
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

export const ArrowSymbol: Story = {
	args: {
		variant: "middle",
		ellipsisSymbol: " ⟷ ",
		lineLimit: 1,
		text: "user@example.com/documents/work/presentations/q4-2024/sales-report-final-reviewed-approved.pdf",
	},
	render: (args: TextTruncateArgs) => renderWithPreview(args),
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
