import type { PalMonsterParameter } from "~/types/PalMonsterParameter";

const requiredPositiveValues = [
    "SlowWalkSpeed",
    "WalkSpeed",
    "RunSpeed",
    "SwimSpeed",
    "SwimDashSpeed",
] satisfies (keyof PalMonsterParameter)[];

const requiredNonZeroValues = ["Rarity"] satisfies (keyof PalMonsterParameter)[];

const workSuitabilityFields = [
    "WorkSuitability_EmitFlame",
    "WorkSuitability_Watering",
    "WorkSuitability_Seeding",
    "WorkSuitability_GenerateElectricity",
    "WorkSuitability_Handcraft",
    "WorkSuitability_Collection",
    "WorkSuitability_Deforest",
    "WorkSuitability_Mining",
    "WorkSuitability_OilExtraction",
    "WorkSuitability_ProductMedicine",
    "WorkSuitability_Cool",
    "WorkSuitability_Transport",
    "WorkSuitability_MonsterFarm",
] satisfies (keyof PalMonsterParameter)[];

export function isValidPal(palData: PalMonsterParameter): boolean {
    if (
        !palData.IsPal ||
        palData.IsBoss ||
        palData.IsTowerBoss ||
        palData.IsRaidBoss ||
        palData.OverrideNameTextID !== palData.NamePrefixID ||
        palData.BiologicalGrade === 99
    ) {
        return false;
    }
    for (const parameter of requiredPositiveValues) {
        if (palData[parameter] < 0) {
            return false;
        }
    }
    for (const parameter of requiredNonZeroValues) {
        if (palData[parameter] < 1) {
            return false;
        }
    }
    let hasWorkSuitability = false;
    for (const parameter of workSuitabilityFields) {
        if (palData[parameter] > 0) {
            hasWorkSuitability = true;
            break;
        }
    }
    if (!hasWorkSuitability) {
        return false;
    }
    return true;
}
