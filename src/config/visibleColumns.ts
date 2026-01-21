import { createEffect, createSignal, runWithOwner } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { userColumnSettings } from "./userColumns";

const [visibleColumns, setVisibleColumns] = createSignal(getVisibleColumns());
export { visibleColumns };

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        setVisibleColumns(getVisibleColumns());
    });
});

function getVisibleColumns(): (keyof CombinedData)[] {
    return userColumnSettings().columnOrder.filter((column) => !userColumnSettings().hidden.includes(column));
}
