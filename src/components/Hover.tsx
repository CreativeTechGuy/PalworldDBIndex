import { autoPlacement, autoUpdate, computePosition, offset, shift } from "@floating-ui/dom";
import { createEffect, createSignal, onCleanup, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { rootElement } from "~/config/rootElement";
import { noop } from "~/utils/noop";

type HoverProps = {
    label: JSXElement;
    children: JSXElement;
};

export function Hover(props: HoverProps): JSXElement {
    let popupRef: HTMLDivElement | undefined;
    let anchorRef: HTMLButtonElement | undefined;
    const [showHover, setShowHover] = createSignal<boolean | "force">(false);
    createEffect(() => {
        if (showHover() === "force" || showHover() === true) {
            let cleanup = noop;
            window.requestAnimationFrame(() => {
                cleanup = autoUpdate(anchorRef!, popupRef!, () => void updatePosition(anchorRef!, popupRef!));
            });
            function clickEvent(evt: PointerEvent): void {
                if (!evt.composedPath().includes(popupRef!)) {
                    setShowHover(false);
                }
            }
            if (showHover() === "force") {
                document.addEventListener("click", clickEvent);
            }
            onCleanup(() => {
                cleanup();
                document.removeEventListener("click", clickEvent);
            });
        } else {
            popupRef?.removeAttribute("style");
        }
    });
    return (
        <>
            <button
                ref={anchorRef}
                class="link-button"
                onMouseEnter={() => {
                    if (showHover() === false) {
                        setShowHover(true);
                    }
                }}
                onMouseLeave={() => {
                    if (showHover() === true) {
                        setShowHover(false);
                    }
                }}
                onClick={() => {
                    setShowHover("force");
                }}
            >
                {props.label}
            </button>
            {(showHover() === "force" || showHover() === true) && (
                <Portal mount={rootElement}>
                    <div class="hover-content" ref={popupRef}>
                        {props.children}
                    </div>
                </Portal>
            )}
        </>
    );
}

async function updatePosition(anchorRef: HTMLButtonElement, popupRef: HTMLDivElement): Promise<void> {
    const data = await computePosition(anchorRef, popupRef, {
        middleware: [offset(16), shift(), autoPlacement()],
    });
    Object.assign(popupRef.style, {
        left: `${data.x}px`,
        top: `${data.y}px`,
    });
}
