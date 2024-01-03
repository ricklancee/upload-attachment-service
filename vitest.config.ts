import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "node",
        environment: "node",
        testTimeout: 360000,
    },
});
