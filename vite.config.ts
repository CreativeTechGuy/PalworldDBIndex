import { resolve } from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import "dotenv/config";

export default defineConfig({
    base: "./",
    plugins: [
        solidPlugin(),
        {
            name: "add-build-date",
            transformIndexHtml: {
                order: "post",
                handler: (html) => {
                    return html
                        .replace("BUILD_DATE", new Date().toLocaleDateString())
                        .replace("GAME_VERSION", process.env.GAME_VERSION ?? "unknown");
                },
            },
        },
    ],
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
