import { createSignal } from "solid-js";

export const [filterSettings, setFilterSettings] = createSignal({
    sortSelectedToTop: false,
    filterText: "",
    filterMatchingRowIds: null as null | string[],
    highlightedRowIds: [] as string[],
});

// eslint-disable-next-line solid/reactivity
const defaultSettings = filterSettings();
export function resetFilterSettings(): void {
    setFilterSettings(defaultSettings);
}
