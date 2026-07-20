// cspell:words PARTNERSKILL
import itemNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json";
import palDescriptions from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json";
import skillNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText_Common.json";
import type RidablePalBlueprintType from "~/raw_data/Pal/Content/Pal/Blueprint/Character/Monster/PalActorBP/Serpent/BP_Serpent.json";
import techUnlocks from "~/raw_data/Pal/Content/Pal/DataTable/Technology/DT_TechnologyRecipeUnlock.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";
import { getPalName } from "~/utils/getPalName";
import { getPalItemDrops } from "./getPalItemDrops";
import { getPalBlueprint } from "./palBlueprints";

export const customColumns = [
    "Id",
    "Name",
    "PalDescription",
    "PartnerSkillUnlockLevel",
    "PartnerSkill",
    "ItemDrops",
    "SpawnLocations",
    "Rideable",
    "CombatStatTotal",
    "CombatStatTotalWithFriendship",
    "HpWithFriendship",
    "AttackWithFriendship",
    "DefenseWithFriendship",
    "Breeding",
] as const;

export type DerivedPalData = Record<(typeof customColumns)[number], string>;

const descriptionsMap = convertDataTableType(palDescriptions);
const techUnlockMap = convertDataTableType(techUnlocks);
const skillNameMap = convertDataTableType(skillNames, { partialData: true });
const itemNameMap = convertDataTableType(itemNames);
const maxFriendship = 10;

export function buildCustomData(key: string, palData: PalMonsterParameter): DerivedPalData | null {
    const palName = getPalName(key);
    if (palName === undefined) {
        return null;
    }
    const palDescription = getObjectByCaseInsensitiveKey(descriptionsMap, `PAL_FIRST_SPAWN_DESC_${key}`)!.TextData
        .LocalizedString;
    let partnerSkillUnlockLevel = "";
    let isFlying = false;
    let isFlyingAndGround = false;
    const isRidable = palDescription.includes("Can be ridden");
    let isSwimming = false;
    if (`SkillUnlock_${key}` in techUnlockMap) {
        partnerSkillUnlockLevel = techUnlockMap[`SkillUnlock_${key}`].LevelCap.toString();
    }
    const blueprintStaticCharacterComponent = getPalBlueprint(key, "StaticCharacterParameterComponent");
    if (blueprintStaticCharacterComponent !== undefined) {
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
    }

    return {
        Name: palName,
        HpWithFriendship: Math.round(palData.Hp + palData.Friendship_HP * maxFriendship).toString(),
        AttackWithFriendship: Math.round(palData.ShotAttack + palData.Friendship_ShotAttack * maxFriendship).toString(),
        DefenseWithFriendship: Math.round(palData.Defense + palData.Friendship_Defense * maxFriendship).toString(),
        ItemDrops: getPalItemDrops(key)
            .map((item) => getObjectByCaseInsensitiveKey(itemNameMap, `ITEM_NAME_${item.Id}`)!.TextData.LocalizedString)
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
        CombatStatTotalWithFriendship: Math.round(
            palData.ShotAttack +
                palData.Defense +
                palData.Hp +
                palData.Friendship_HP * maxFriendship +
                palData.Friendship_Defense * maxFriendship +
                palData.Friendship_ShotAttack * maxFriendship
        ).toString(),
        Breeding: "Combinations",
        PartnerSkill: skillNameMap[`PARTNERSKILL_${key}`]?.TextData.LocalizedString ?? "",
        PartnerSkillUnlockLevel: partnerSkillUnlockLevel,
        SpawnLocations: "Map",
        PalDescription: palDescription,
        Id: key,
    };
}
