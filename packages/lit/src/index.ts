import type {
	FontWidthMap,
	MiddleEllipsisConfig,
} from "@dynamic-middle-ellipsis/core";
import { MiddleEllipsis } from "./MiddleEllipsis";

const createMiddleEllipsis = (config?: MiddleEllipsisConfig) => {
	// If config is provided, create a custom element class with the config
	if (config) {
		class ConfiguredMiddleEllipsis extends MiddleEllipsis {
			config = config;
		}
		return ConfiguredMiddleEllipsis;
	}

	return MiddleEllipsis;
};

export type { FontWidthMap, MiddleEllipsisConfig };
export { MiddleEllipsis };
export default createMiddleEllipsis;
