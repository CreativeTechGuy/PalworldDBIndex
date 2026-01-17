import basicPalData from "~/raw_data/DT_PalMonsterParameter.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";

const dataRows = basicPalData[0].Rows;

export function getPalBossData(palId: string): PalMonsterParameter {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- It may not exist
    const data = dataRows[`BOSS_${palId}` as keyof typeof dataRows] ?? dataRows[palId as keyof typeof dataRows];
    return data;
}
