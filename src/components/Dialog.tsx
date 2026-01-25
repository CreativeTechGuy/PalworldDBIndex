/* eslint-disable jsx-a11y/no-static-element-interactions */
import { createEffect, onCleanup, type JSXElement } from "solid-js";
import closeIcon from "~/icons/close.svg";

type DialogProps = {
    onClose: () => void;
    title: string;
    children: JSXElement;
};

export function Dialog(props: DialogProps): JSXElement {
    createEffect(() => {
        function keyboardEvent(evt: KeyboardEvent): void {
            if (evt.key === "Escape") {
                props.onClose();
            }
        }
        document.addEventListener("keypress", keyboardEvent);
        onCleanup(() => {
            document.removeEventListener("keypress", keyboardEvent);
        });
    });
    return (
        <div
            class="dialog-backdrop"
            onMouseDown={() => {
                props.onClose();
            }}
        >
            <div
                class="dialog-container"
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <div class="dialog-header">
                    <div class="dialog-title">{props.title}</div>
                    <button
                        class="link-button"
                        onClick={() => {
                            props.onClose();
                        }}
                    >
                        <img src={closeIcon} style={{ width: "1.3rem", height: "1.3rem" }} alt="Close icon" />
                    </button>
                </div>
                <div class="dialog-scroll-area">{props.children}</div>
            </div>
        </div>
    );
}
