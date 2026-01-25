// cspell:ignore Loaction
import "dotenv/config";
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

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
                "PlacementType",
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
    "DT_BossSpawnerLoactionData.json": (key, value) => {
        if (key === "Z") {
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
            ["OnlyTime", "Weight", "OnlyWeather", "bIsAllowRandomizer"].includes(key) ||
            key.startsWith("NumMin_") ||
            key.startsWith("NumMax_") ||
            key.startsWith("NPC_")
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

export default defineConfig({
    base: "./",
    plugins: [
        solidPlugin(),
        {
            name: "add-build-date",
            transformIndexHtml: {
                order: "post",
                handler: (html) => {
                    return html
                        .replace("BUILD_DATE", new Date().toLocaleDateString())
                        .replace("GAME_VERSION", process.env.GAME_VERSION ?? "unknown");
                },
            },
        },
        {
            name: "remove-json-fields",
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
        },
    ],
    resolve: {
        alias: {
            "~": resolve(import.meta.dirname, "src"),
        },
    },
    clearScreen: false,
    server: {
        host: "0.0.0.0",
        port: 4143,
        allowedHosts: true,
        strictPort: true,
        hmr: {
            overlay: false,
        },
    },
    build: {
        target: browserslistToEsbuild(),
        assetsInlineLimit: 0,
        license: {
            fileName: "license.txt",
        },
    },
});
