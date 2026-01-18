import { resolve } from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    base: "./",
    plugins: [solidPlugin()],
    resolve: {
        alias: {
            "~": resolve(import.meta.dirname, "src"),
        },
    },
    clearScreen: false,
    server: {
        host: "0.0.0.0",
        port: 4143,
        allowedHosts: true,
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
