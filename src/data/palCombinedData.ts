import { createSignal } from "solid-js";
import basicPalData from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalMonsterParameter.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { isValidPal } from "~/utils/isValidPal";
import { buildCustomData, type DerivedPalData } from "./buildCustomData";

export type CombinedData = PalMonsterParameter & DerivedPalData;

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
