import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/web-components";
import * as projectAnnotations from "./preview";

// This is an important step to apply the right configuration when testing your stories.
// This will load your Storybook config and apply it to the tests.
const project = setProjectAnnotations([projectAnnotations]);

// Run Storybook's beforeAll hook
beforeAll(project.beforeAll);
