import "dotenv/config";
import { resolve } from "node:path";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { viteNoReloadOnError } from "./scripts/viteNoReloadOnError";
import { pruneJsonPlugin } from "./scripts/vitePruneJson";

// Change this to true to see each JSON file as an individual file to check what gets bundled.
const debugJsonPruning = false as boolean;

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
        pruneJsonPlugin(),
        viteNoReloadOnError(),
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
    json: {
        stringify: debugJsonPruning ? false : undefined,
    },
    build: {
        target: browserslistToEsbuild(),
        assetsInlineLimit: 0,
        license: {
            fileName: "license.txt",
        },
        rollupOptions: {
            output: {
                preserveModules: debugJsonPruning ? true : undefined,
            },
            preserveEntrySignatures: debugJsonPruning ? "exports-only" : undefined,
        },
    },
});
