import { createEffect, createSignal, runWithOwner } from "solid-js";
import { customColumns } from "~/data/buildCustomData";
import { rows, type CombinedData } from "~/data/palCombinedData";
import { arrayIncludes } from "~/utils/arrayIncludes";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { loadOrDefault } from "./loadOrDefault";
import { defaultColumnOrder, defaultHiddenColumns, forceHiddenColumns } from "./tableColumns";

const defaultSettings = {
    columnOrder: ([...new Set([...defaultColumnOrder, ...Object.keys(rows()[0])])] as (keyof CombinedData)[]).filter(
        (column) => !forceHiddenColumns.includes(column)
    ),
    hidden: [...defaultHiddenColumns],
};

const redundantColumns = defaultSettings.columnOrder.filter((column) => {
    if (arrayIncludes(customColumns, column)) {
        return false;
    }
    const firstValue = rows()[0][column];
    let shouldHide = true;
    for (const row of rows()) {
        if (row[column] !== firstValue) {
            shouldHide = false;
            break;
        }
    }
    return shouldHide;
});

defaultSettings.hidden = [...new Set([...defaultSettings.hidden, ...redundantColumns])];

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
