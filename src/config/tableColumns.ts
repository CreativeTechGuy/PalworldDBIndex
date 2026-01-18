import { createEffect, createSignal } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { loadOrDefault } from "./loadOrDefault";

export const defaultColumnOrder: (keyof CombinedData)[] = [
    "Name",
    "ElementType1",
    "ElementType2",
    "ZukanIndex",
    "SpawnLocations",
    "MinimumSphere",
    "SlowWalkSpeed",
    "WalkSpeed",
    "RunSpeed",
    "RideSprintSpeed",
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
    "Rarity",
    "Hp",
    "MeleeAttack",
    "ShotAttack",
    "Defense",
    "CraftSpeed",
];

export const unmovableColumns: (keyof CombinedData)[] = ["Name"];

export const forceHiddenColumns: (keyof CombinedData)[] = [
    "OverrideNameTextID",
    "NamePrefixID",
    "OverridePartnerSkillTextID",
    "IsPal",
    "IsBoss",
    "IsTowerBoss",
    "IsRaidBoss",
    "UseBossHPGauge",
    "MeshCapsuleHalfHeight",
    "MeshCapsuleRadius",
    // @ts-expect-error -- This will be removed from the object before it's used
    "MeshRelativeLocation",
];

export const defaultHiddenColumns: (keyof CombinedData)[] = [
    "Id",
    "Tribe",
    "BPClass",
    "ZukanIndexSuffix",
    "GenusCategory",
    "Organization",
    "AIResponse",
    "BiologicalGrade",
    "BattleBGM",
    "ViewingDistance",
    "ViewingAngle",
    "CombiDuplicatePriority",
];

export const [userColumnSettings, setUserColumnSettings] = createSignal(
    loadOrDefault("column-settings", {
        columnsFirst: [] as string[],
        columnsLast: [] as string[],
        hidden: [...defaultHiddenColumns],
    })
);

createEffect(() => {
    const settings = userColumnSettings();
    localStorage.setItem("column-settings", JSON.stringify(settings));
});
