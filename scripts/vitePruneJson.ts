import { readFileSync } from "node:fs";
import { basename } from "node:path";
import type { PluginOption } from "vite";

function l10nTrim(key: string, value: unknown): unknown {
    if (["SourceString", "Namespace", "Key"].includes(key)) {
        return undefined;
    }
    return value;
}

const jsonFieldsToTransform: Record<string, (key: string, value: unknown) => unknown> = {
    "DT_PaldexDistributionData.json": (key, value) => {
        if (key === "Z") {
            return undefined;
        }
        if (key === "X" || key === "Y") {
            return Math.round(value as number);
        }
        return value;
    },
    "DT_PalSpawnerPlacement.json": (key, value) => {
        if (
            [
                "Z",
                "SpawnerClass",
                "SpawnerType",
                "LayerNames",
                "InstanceName",
                "WorldName",
                "RadiusType",
                "RespawnCoolTime",
            ].includes(key)
        ) {
            return undefined;
        }
        if (key === "X" || key === "Y") {
            return Math.round(value as number);
        }
        return value;
    },
    "DT_PalCharacterIconDataTable.json": (key, value) => {
        if (key === "SubPathString") {
            return undefined;
        }
        return value;
    },
    "DT_PassiveSkill_Main.json": (key, value) => {
        if (typeof value === "boolean") {
            return undefined;
        }
        return value;
    },
    "BP_PalGameSetting.json": (key, value) => {
        if (
            key.match(/^\d+$/) !== null ||
            ["", "Type", "Properties", "CaptureJudgeRateArray", "CaptureSphereLevelMap", "Key", "Value"].includes(key)
        ) {
            return value;
        }
        return undefined;
    },
    "DT_PalWildSpawner.json": (key, value) => {
        if (
            ["Weight", "OnlyWeather", "bIsAllowRandomizer"].includes(key) ||
            key.startsWith("NumMin_") ||
            key.startsWith("NumMax_") ||
            key.startsWith("NPC_")
        ) {
            return undefined;
        }
        return value;
    },
    "DT_PalFishingSpotLotteryDataTable.json": (key, value) => {
        if (
            ["Weight", "GainItemLotteryName", "Difficulty", "DecreaseDurability", "FishingSpotDifficulty"].includes(key)
        ) {
            return undefined;
        }
        return value;
    },
    "DT_PalFishShadowDataTable.json.json": (key, value) => {
        if (
            [
                "FishShadowSize",
                "BlueprintClassName",
                "FishShadowBlueprintClassSoft",
                "MoveSpeedPerSec",
                "SearchRadius",
                "SearchProbability",
                "KingPassiveRate",
                "RarePassiveRate",
                "BehaviorType",
            ].includes(key)
        ) {
            return undefined;
        }
        return value;
    },
    "DT_ItemDescriptionText_Common.json": l10nTrim,
    "DT_ItemNameText_Common.json": l10nTrim,
    "DT_MapObjectNameText_Common.json": l10nTrim,
    "DT_PalFirstActivatedInfoText.json": l10nTrim,
    "DT_PalNameText_Common.json": l10nTrim,
    "DT_SkillDescText_Common.json": l10nTrim,
    "DT_SkillNameText_Common.json": l10nTrim,
    "DT_UI_Common_Text_Common.json": l10nTrim,
};

function trimPalActorBlueprint(json: string): string {
    const jsonObj = JSON.parse(json) as Record<string, unknown>[];
    return JSON.stringify(
        jsonObj.filter((obj) => {
            // cspell:words Interactable
            if (
                [
                    "SphereComponent",
                    "SimpleConstructionScript",
                    "SCS_Node",
                    "PalSkeletalMeshComponent",
                    "PalShooterSpringArmComponent",
                    "PalInteractableSphereComponentNative",
                    "PalFootIKComponent",
                    "PalBodyPartsCapsuleComponent",
                    "PalBodyPartsSphereComponent",
                    "PalCharacterAroundInfoCollectorComponent",
                ].includes(obj.Type as string)
            ) {
                return false;
            }
            return true;
        })
    );
}

export function pruneJsonPlugin(): PluginOption {
    return {
        name: "prune-json",
        load: (id) => {
            const filename = basename(id);
            if (filename in jsonFieldsToTransform) {
                const code = readFileSync(id, "utf-8");
                const transformations = jsonFieldsToTransform[filename];
                const jsonObj = JSON.parse(code) as unknown;
                return JSON.stringify(jsonObj, transformations);
            }
            if (id.includes("/PalActorBP/")) {
                return trimPalActorBlueprint(readFileSync(id, "utf-8"));
            }
            return null;
        },
    };
}
