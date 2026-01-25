import type { CombinedData } from "~/data/palCombinedData";

export const defaultColumnOrder: (keyof CombinedData)[] = [
    "Name",
    "ElementType1",
    "ElementType2",
    "ZukanIndex",
    "SpawnLocations",
    "MinimumSphere",
    "Breeding",
    "Rarity",
    "CombatStatTotal",
    "CombatStatTotalWithFriendship",
    "Hp",
    "ShotAttack",
    "Defense",
    "WalkSpeed",
    "RunSpeed",
    "RideSprintSpeed",
    "Rideable",
    "SwimSpeed",
    "SwimDashSpeed",
    "Stamina",
    "WorkSuitability_EmitFlame",
    "WorkSuitability_Seeding",
    "WorkSuitability_Handcraft",
    "WorkSuitability_Deforest",
    "WorkSuitability_ProductMedicine",
    "WorkSuitability_Transport",
    "WorkSuitability_Watering",
    "WorkSuitability_GenerateElectricity",
    "WorkSuitability_Collection",
    "WorkSuitability_Mining",
    "WorkSuitability_Cool",
    "WorkSuitability_MonsterFarm",
];

export const unconfigurableColumns: (keyof CombinedData)[] = ["Name"];

export const forceHiddenColumns: (keyof CombinedData)[] = [
    "OverrideNameTextID",
    "NamePrefixID",
    "OverridePartnerSkillTextID",
    "IsPal",
    "MeleeAttack",
    "IsBoss",
    "IsTowerBoss",
    "IsRaidBoss",
    "UseBossHPGauge",
    "ViewingDistance",
    "ViewingAngle",
    "MeshCapsuleHalfHeight",
    "MeshCapsuleRadius",
    // @ts-expect-error -- This will be removed from the object before it's used
    "MeshRelativeLocation",
];

export const defaultHiddenColumns: (keyof CombinedData)[] = [
    "Tribe",
    "BPClass",
    "ZukanIndexSuffix",
    "GenusCategory",
    "Organization",
    "AIResponse",
    "BiologicalGrade",
    "BattleBGM",
    "CombiDuplicatePriority",
    "CombiRank",
    "IgnoreCombi",
    "Support",
    "CaptureRateCorrect",
    "ExpRatio",
];

export const unsortableColumns: (keyof CombinedData)[] = ["MinimumSphere", "ItemDrops"];
