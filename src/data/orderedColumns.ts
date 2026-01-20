import { createSignal, createEffect, runWithOwner } from "solid-js";
import { defaultColumnOrder, unmovableLeftColumns, forceHiddenColumns } from "~/config/tableColumns";
import { userColumnSettings } from "~/config/userColumns";
import { arrayIncludes } from "~/utils/arrayIncludes";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { customColumns } from "./buildCustomData";
import { type CombinedData, rows } from "./palCombinedData";

export const [columnOrder, setColumnOrder] = createSignal<(keyof CombinedData)[]>([]);
export const configurableColumns = buildColumnOrder({
    firstColumns: defaultColumnOrder,
    lastColumns: [],
    hiddenColumns: [...unmovableLeftColumns, ...forceHiddenColumns],
    hideRedundantColumns: false,
});
runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        setColumnOrder(
            buildColumnOrder({
                firstColumns: [
                    ...new Set([
                        ...unmovableLeftColumns,
                        ...(userColumnSettings().columnsFirst as (keyof CombinedData)[]),
                        ...defaultColumnOrder,
                    ]),
                ],
                lastColumns: userColumnSettings().columnsLast as (keyof CombinedData)[],
                hiddenColumns: [...new Set([...userColumnSettings().hidden, ...forceHiddenColumns])],
                hideRedundantColumns: userColumnSettings().autoHideRedundantColumns,
            })
        );
    });
});

function buildColumnOrder<Value extends keyof CombinedData>(options: {
    firstColumns: Value[];
    lastColumns: Value[];
    hiddenColumns: Value[];
    hideRedundantColumns: boolean;
}): Value[] {
    const columns: Value[] = [...options.firstColumns];
    // Any columns which are the same for every pal
    const redundantColumns: Value[] = [];
    for (const property in rows()[0]) {
        if (!arrayIncludes(columns, property) && !arrayIncludes(options.hiddenColumns, property)) {
            columns.push(property as Value);
        }
    }
    if (options.hideRedundantColumns) {
        for (const column of columns) {
            if (
                arrayIncludes(customColumns, column) ||
                arrayIncludes(options.firstColumns, column) ||
                arrayIncludes(options.lastColumns, column) ||
                arrayIncludes(options.hiddenColumns, column)
            ) {
                continue;
            }
            const firstValue = rows()[0][column];
            let shouldHide = true;
            for (const row of rows()) {
                if (row[column] !== firstValue) {
                    shouldHide = false;
                    break;
                }
            }
            if (shouldHide) {
                redundantColumns.push(column);
            }
        }
    }
    for (const column of [...options.hiddenColumns, ...redundantColumns]) {
        if (columns.includes(column)) {
            columns.splice(columns.indexOf(column), 1);
        }
    }
    for (const column of options.lastColumns) {
        if (columns.includes(column)) {
            columns.splice(columns.indexOf(column), 1);
        }
        columns.push(column);
    }
    return columns;
}
