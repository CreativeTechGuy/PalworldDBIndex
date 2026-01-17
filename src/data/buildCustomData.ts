import palDescriptions from "~/raw_data/DT_PalFirstActivatedInfoText.json";
import palNames from "~/raw_data/DT_PalNameText_Common.json";
import type { DerivedPalData } from "~/types/DerivedPalData";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";

const palNamesMap = palNames[0].Rows;
const descriptionsMap = palDescriptions[0].Rows;

export function buildCustomData(key: string, _palData: PalMonsterParameter): DerivedPalData | null {
    const localizedKey = `PAL_NAME_${key}` in palNamesMap ? (`PAL_NAME_${key}` as keyof typeof palNamesMap) : null;
    if (localizedKey === null) {
        return null;
    }
    return {
        Id: key,
        Name: palNames[0].Rows[localizedKey].TextData.LocalizedString,
        MinimumSphere: "Spheres",
        PalDescription:
            descriptionsMap[`PAL_FIRST_SPAWN_DESC_${key}` as keyof typeof descriptionsMap].TextData.LocalizedString,
    };
}
