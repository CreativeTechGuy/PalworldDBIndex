import type { PluginOption, HotPayload, HmrOptions } from "vite";

/**
 * Prevents reloading dev server on an error but still displays the error in the console.
 */
export function viteNoReloadOnError(): PluginOption {
    let isSyntaxErrorReload = false;
    let isEnabled = false;
    return {
        name: "no-reload-on-error",
        config: function (userConfig) {
            if (userConfig.server?.hmr === true || typeof userConfig.server?.hmr === "object") {
                isEnabled = true;
            }
            if (!isEnabled) {
                return;
            }
            if (typeof userConfig.server?.hmr === "object" && userConfig.server.hmr.overlay === false) {
                return;
            }
            this.warn(
                "Vite HMR overlay is not supported with no-reload-on-error plugin. Set `server.hmr.overlay` to false to hide this warning."
            );
            userConfig.server ??= {};
            const hmrBoolean = typeof userConfig.server.hmr === "boolean";
            if (hmrBoolean) {
                userConfig.server.hmr = {
                    overlay: false,
                };
            } else {
                userConfig.server.hmr ??= {};
                (userConfig.server.hmr as HmrOptions).overlay = false;
            }
        },
        configureServer: (server) => {
            if (!isEnabled) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const realSend = server.hot.send;
            server.hot.send = (...args: unknown[]) => {
                let payload;
                if (typeof args[0] === "string") {
                    payload = {
                        type: "custom",
                        event: args[0],
                        data: args[1],
                    } satisfies HotPayload;
                } else {
                    payload = args[0] as HotPayload;
                }
                if (payload.type === "error") {
                    isSyntaxErrorReload = true;
                }
                if (payload.type === "full-reload" && isSyntaxErrorReload) {
                    isSyntaxErrorReload = false;
                    return;
                }
                realSend(payload);
            };
        },
    };
}
