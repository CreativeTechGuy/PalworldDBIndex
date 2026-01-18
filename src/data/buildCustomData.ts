// cspell:words PARTNERSKILL
import itemNames from "~/raw_data/DT_ItemNameText_Common.json";
import palDescriptions from "~/raw_data/DT_PalFirstActivatedInfoText.json";
import palNames from "~/raw_data/DT_PalNameText_Common.json";
import skillNames from "~/raw_data/DT_SkillNameText_Common.json";
import techUnlocks from "~/raw_data/DT_TechnologyRecipeUnlock.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getPalItemDrops } from "./getPalItemDrops";
import { getPalBlueprint } from "./palBlueprints";

export const customColumns = [
    "Id",
    "Name",
    "MinimumSphere",
    "PalDescription",
    "PartnerSkillUnlockLevel",
    "PartnerSkill",
    "ItemDrops",
    "SpawnLocations",
] as const;

export type DerivedPalData = Record<(typeof customColumns)[number], string>;

const palNamesMap = convertDataTableType(palNames);
const descriptionsMap = convertDataTableType(palDescriptions);
const techUnlockMap = convertDataTableType(techUnlocks);
const skillNameMap = convertDataTableType(skillNames, { partialData: true });
const itemNameMap = convertDataTableType(itemNames);

export function buildCustomData(key: string, _palData: PalMonsterParameter): DerivedPalData | null {
    const localizedKey = `PAL_NAME_${key}` in palNamesMap ? `PAL_NAME_${key}` : null;
    if (localizedKey === null) {
        return null;
    }
    let partnerSkillUnlockLevel = "";
    const blueprint = getPalBlueprint(key);
    if (blueprint !== undefined) {
        const partnerSkillComponent = blueprint.find((item) => item.Type === "PalPartnerSkillParameterComponent");
        if (partnerSkillComponent !== undefined) {
            const skillUnlockItem = partnerSkillComponent.Properties?.RestrictionItems?.[0].Key;
            if (skillUnlockItem !== undefined && skillUnlockItem in techUnlockMap) {
                partnerSkillUnlockLevel = techUnlockMap[skillUnlockItem].LevelCap.toString();
            }
        }
    }

    return {
        Id: key,
        Name: palNamesMap[localizedKey].TextData.LocalizedString,
        MinimumSphere: "Spheres",
        ItemDrops: getPalItemDrops(key)
            .map((item) => itemNameMap[`ITEM_NAME_${item.Id}`].TextData.LocalizedString)
            .join(", "),
        PartnerSkill: skillNameMap[`PARTNERSKILL_${key}`]?.TextData.LocalizedString ?? "",
        PartnerSkillUnlockLevel: partnerSkillUnlockLevel,
        SpawnLocations: "Map",
        PalDescription: descriptionsMap[`PAL_FIRST_SPAWN_DESC_${key}`].TextData.LocalizedString,
    };
}
