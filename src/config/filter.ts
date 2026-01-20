import { createSignal } from "solid-js";

const defaultSettings = {
    sortSelectedToTop: false,
    filterText: "",
    filterMatchingRowIds: null as null | string[],
    highlightedRowIds: [] as string[],
};

export const [filterSettings, setFilterSettings] = createSignal(defaultSettings);

export function resetFilterSettings(): void {
    setFilterSettings(defaultSettings);
}
