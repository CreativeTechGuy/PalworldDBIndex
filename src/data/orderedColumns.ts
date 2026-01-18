import { createSignal, createEffect } from "solid-js";
import {
    userColumnSettings,
    defaultColumnOrder,
    unmovableLeftColumns,
    forceHiddenColumns,
} from "~/config/tableColumns";
import { arrayIncludes } from "~/utils/arrayIncludes";
import { customColumns } from "./buildCustomData";
import { type CombinedData, rows } from "./palCombinedData";

export const [columnOrder, setColumnOrder] = createSignal<(keyof CombinedData)[]>([]);
export const configurableColumns = buildColumnOrder({
    firstColumns: defaultColumnOrder,
    lastColumns: [],
    hiddenColumns: [...unmovableLeftColumns, ...forceHiddenColumns],
});

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
        })
    );
});

function buildColumnOrder<Value extends keyof CombinedData>(options: {
    firstColumns: Value[];
    lastColumns: Value[];
    hiddenColumns: Value[];
}): Value[] {
    const columns: Value[] = [...options.firstColumns];
    // Any columns which are the same for every pal
    const redundantColumns: Value[] = [];
    for (const property in rows()[0]) {
        if (!arrayIncludes(columns, property) && !arrayIncludes(options.hiddenColumns, property)) {
            columns.push(property as Value);
        }
    }
    for (const column of columns) {
        if (
            arrayIncludes(customColumns, column) ||
            arrayIncludes(options.firstColumns, column) ||
            arrayIncludes(options.lastColumns, column)
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
