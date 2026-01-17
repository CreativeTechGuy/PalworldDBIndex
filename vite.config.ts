import { resolve } from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    plugins: [solidPlugin()],
    resolve: {
        alias: {
            "~": resolve(import.meta.dirname, "src"),
        },
    },
    clearScreen: false,
    server: {
        port: 4143,
        strictPort: true,
        hmr: {
            overlay: false,
        },
    },
    build: {
        assetsInlineLimit: 0,
        license: {
            fileName: "license.txt",
        },
    },
});
