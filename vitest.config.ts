import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            // The obsidian package has no main/module field — redirect to a stub.
            obsidian: resolve(__dirname, "src/tests/__mocks__/obsidian.ts"),
        },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
