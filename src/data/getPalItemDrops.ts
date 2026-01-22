import raidData from "~/raw_data/Pal/Content/Pal/Blueprint/RaidBoss/DT_PalRaidBoss.json";
import palItemDrops from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalDropItem.json";
import { convertDataTableType } from "~/utils/convertDataTableType";

type ItemDrops = {
    Id: string;
    Rate: number;
    Min: number;
    Max: number;
};

const dropData = Object.values(convertDataTableType(palItemDrops));
const raidDropData = convertDataTableType(raidData, { partialData: true });

export function getPalItemDrops(id: string): ItemDrops[] {
    const itemDrops = dropData.find((data) => data.CharacterID.toLowerCase() === id.toLowerCase());
    if (itemDrops !== undefined) {
        return Array.from({ length: 10 })
            .map((_, index) => ({
                Id: itemDrops[`ItemId${index + 1}` as keyof typeof itemDrops] as string,
                Rate: itemDrops[`Rate${index + 1}` as keyof typeof itemDrops] as number,
                Min: itemDrops[`min${index + 1}` as keyof typeof itemDrops] as number,
                Max: itemDrops[`Max${index + 1}` as keyof typeof itemDrops] as number,
            }))
            .filter((item) => item.Id !== "None" && item.Rate > 0 && item.Max > 0);
    }
    const raidPalData = raidDropData[`PalSummon_${id}`];
    if (raidPalData !== undefined) {
        return [
            ...raidPalData.SuccessItemList.map((item) => ({
                Id: item.ItemName.Key,
                Rate: item.Rate,
                Min: item.Min,
                Max: item.Max,
            })),
            ...raidPalData.SuccessAnyOneItemList.map((item) => ({
                Id: item.ItemName.Key,
                Rate: Math.round((1 / raidPalData.SuccessAnyOneItemList.length) * 100),
                Min: item.Num,
                Max: item.Num,
            })),
        ];
    }
    return [];
}
