// cspell:words PARTNERSKILL
import itemNames from "~/raw_data/DT_ItemNameText_Common.json";
import palDescriptions from "~/raw_data/DT_PalFirstActivatedInfoText.json";
import palNames from "~/raw_data/DT_PalNameText_Common.json";
import skillNames from "~/raw_data/DT_SkillNameText_Common.json";
import techUnlocks from "~/raw_data/DT_TechnologyRecipeUnlock.json";
import type RidablePalBlueprintType from "~/raw_data/PalActorBP/Serpent/BP_Serpent.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";
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
    "Rideable",
    "CombatStatTotal",
    "CombatStatTotalFriendship",
] as const;

export type DerivedPalData = Record<(typeof customColumns)[number], string>;

const palNamesMap = convertDataTableType(palNames);
const descriptionsMap = convertDataTableType(palDescriptions);
const techUnlockMap = convertDataTableType(techUnlocks);
const skillNameMap = convertDataTableType(skillNames, { partialData: true });
const itemNameMap = convertDataTableType(itemNames);

export function buildCustomData(key: string, palData: PalMonsterParameter): DerivedPalData | null {
    const palName = getObjectByCaseInsensitiveKey(palNamesMap, `PAL_NAME_${key}`)?.TextData.LocalizedString;
    if (palName === undefined) {
        return null;
    }
    let partnerSkillUnlockLevel = "";
    let isFlying = false;
    let isFlyingAndGround = false;
    let isRidable = false;
    let isSwimming = false;
    const blueprintSkillParameterComponent = getPalBlueprint(key, "PalPartnerSkillParameter_GEN_VARIABLE");

    if (blueprintSkillParameterComponent !== undefined) {
        const skillUnlockItem = blueprintSkillParameterComponent.Properties?.RestrictionItems?.[0].Key;
        if (skillUnlockItem !== undefined && skillUnlockItem in techUnlockMap) {
            partnerSkillUnlockLevel = techUnlockMap[skillUnlockItem].LevelCap.toString();
        }
    }
    const blueprintStaticCharacterComponent = getPalBlueprint(key, "StaticCharacterParameterComponent");
    if (blueprintStaticCharacterComponent !== undefined) {
        if (
            blueprintStaticCharacterComponent.Properties?.GeneralBlendSpaceMap?.some((item) =>
                item.Key.endsWith("RidingMove")
            ) === true
        ) {
            isRidable = true;
        }
        const movementType = (blueprintStaticCharacterComponent as (typeof RidablePalBlueprintType)[number]).Properties
            ?.MovementType;
        if (movementType?.includes("::Fly") === true) {
            if (movementType.includes("::FlyAndLanding")) {
                isFlyingAndGround = true;
            } else {
                isFlying = true;
            }
        }
        if (movementType?.endsWith("::Swim") === true) {
            isSwimming = true;
        }
        if (isSwimming || isFlying || isFlyingAndGround) {
            isRidable = true;
        }
    }

    return {
        Id: key,
        Name: palName,
        MinimumSphere: "Spheres",
        ItemDrops: getPalItemDrops(key)
            .map((item) => itemNameMap[`ITEM_NAME_${item.Id}`].TextData.LocalizedString)
            .join(", "),
        Rideable: isRidable
            ? isFlyingAndGround
                ? "Flying/Land"
                : isFlying
                  ? "Flying"
                  : isSwimming
                    ? "Water"
                    : "Land"
            : "",
        CombatStatTotal: (palData.ShotAttack + palData.Defense + palData.Hp).toString(),
        CombatStatTotalFriendship: Math.round(
            palData.ShotAttack +
                palData.Defense +
                palData.Hp +
                palData.Friendship_HP * 10 +
                palData.Friendship_Defense * 10 +
                palData.Friendship_ShotAttack * 10
        ).toString(),
        PartnerSkill: skillNameMap[`PARTNERSKILL_${key}`]?.TextData.LocalizedString ?? "",
        PartnerSkillUnlockLevel: partnerSkillUnlockLevel,
        SpawnLocations: "Map",
        PalDescription: getObjectByCaseInsensitiveKey(descriptionsMap, `PAL_FIRST_SPAWN_DESC_${key}`)!.TextData
            .LocalizedString,
    };
}
