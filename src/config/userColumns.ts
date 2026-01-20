import { createEffect, createSignal, runWithOwner } from "solid-js";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { loadOrDefault } from "./loadOrDefault";
import { defaultHiddenColumns } from "./tableColumns";

const defaultSettings = {
    columnsFirst: [] as string[],
    columnsLast: [] as string[],
    hidden: [...defaultHiddenColumns],
    autoHideRedundantColumns: true,
};

export const [userColumnSettings, setUserColumnSettings] = createSignal(
    loadOrDefault("column-settings", defaultSettings)
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        const settings = userColumnSettings();
        localStorage.setItem("column-settings", JSON.stringify(settings));
    });
});

export function resetColumnSettings(): void {
    setUserColumnSettings(defaultSettings);
}
