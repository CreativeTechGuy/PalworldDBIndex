/* eslint-disable solid/reactivity */
import { createSignal } from "solid-js";
import { columnOrder, defaultHiddenColumns } from "~/config/tableColumns";
import basicPalData from "~/raw_data/DT_PalMonsterParameter.json";
import { customColumns, type DerivedPalData } from "~/types/DerivedPalData";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { arrayIncludes } from "~/utils/arrayIncludes";
import { isValidPal } from "~/utils/isValidPal";
import { buildCustomData } from "./buildCustomData";

export type CombinedData = PalMonsterParameter & DerivedPalData;

// Any columns which are the same for every pal
const redundantColumns: (keyof CombinedData)[] = [];

export const [rows, setRows] = createSignal<CombinedData[]>([]);

for (const [key, data] of Object.entries(basicPalData[0].Rows)) {
    if (isValidPal(data)) {
        const customData = buildCustomData(key, data);
        if (customData === null) {
            continue;
        }
        setRows((current) => {
            return [
                ...current,
                {
                    ...data,
                    ...customData,
                },
            ];
        });
    }
}

export const columns: (keyof CombinedData)[] = [...columnOrder];
for (const property in rows()[0]) {
    if (!arrayIncludes(columns, property)) {
        columns.push(property as keyof CombinedData);
    }
}
for (const column of columns) {
    if (arrayIncludes(customColumns, column)) {
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
for (const column of [...defaultHiddenColumns, ...redundantColumns]) {
    if (columns.includes(column)) {
        columns.splice(columns.indexOf(column), 1);
    }
}
