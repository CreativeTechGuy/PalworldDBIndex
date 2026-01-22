import basicPalData from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalMonsterParameter.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { convertDataTableType } from "./convertDataTableType";

const dataRows = convertDataTableType(basicPalData);

export function getPalBossData(palId: string): PalMonsterParameter {
    const data = dataRows[`BOSS_${palId}`] ?? dataRows[palId];
    return data;
}
