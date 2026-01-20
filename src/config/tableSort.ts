import { createEffect, createSignal, runWithOwner } from "solid-js";
import { columnOrder } from "~/data/orderedColumns";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { restrictValueToList } from "~/utils/restrictValueToList";
import { loadOrDefault } from "./loadOrDefault";

const defaultSortColumn = "Name";
const defaultSortDirectionAscending = true;

export const [lastSortedColumn, setLastSortedColumn] = createSignal<ReturnType<typeof columnOrder>[number]>(
    restrictValueToList(loadOrDefault("table-sort-column", defaultSortColumn), columnOrder(), defaultSortColumn)
);
export const [lastSortDirectionAscending, setLastSortDirectionAscending] = createSignal(
    loadOrDefault<string>("table-sort-direction-ascending", defaultSortDirectionAscending.toString()) === "true"
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        localStorage.setItem("table-sort-column", lastSortedColumn());
        localStorage.setItem("table-sort-direction-ascending", lastSortDirectionAscending().toString());
    });
});

export function resetTableSort(): void {
    setLastSortedColumn(defaultSortColumn);
    setLastSortDirectionAscending(defaultSortDirectionAscending);
}
