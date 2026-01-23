import deepmerge from "deepmerge";
import type PalBlueprintType1 from "~/raw_data/Pal/Content/Pal/Blueprint/Character/Monster/PalActorBP/DrillGame/BP_DrillGame.json";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";

type PalBlueprintType = typeof PalBlueprintType1;

export const palBlueprints: Record<string, PalBlueprintType> = import.meta.glob(
    [
        "~/raw_data/Pal/Content/Pal/Blueprint/Character/Monster/PalActorBP/*/BP_*.json",
        "!~/raw_data/Pal/Content/Pal/Blueprint/Character/Monster/PalActorBP/*/BP_*_BOSS*.json",
    ],
    { eager: true, import: "default" }
);
if (Object.keys(palBlueprints).length === 0) {
    throw new Error("Missing Pal blueprints");
}

export function getPalBlueprint(id: string, sectionName: string): PalBlueprintType[number] | undefined {
    const blueprint =
        getObjectByCaseInsensitiveKey(
            palBlueprints,
            `/src/raw_data/Pal/Content/Pal/Blueprint/Character/Monster/PalActorBP/${id.split("_")[0]}/BP_${id}.json`
        ) ??
        getObjectByCaseInsensitiveKey(
            palBlueprints,
            `/src/raw_data/Pal/Content/Pal/Blueprint/Character/Monster/PalActorBP/${id.split("_")[0]}/BP_${id}_Normal.json`
        );
    const section = blueprint?.find((item) => item.Name === sectionName);
    const parentFile = blueprint
        ?.find((item) => item.Type === "BlueprintGeneratedClass")
        ?.Super?.ObjectName.match(/'(.*?)'/)?.[1]
        .replace(/(Default__)?BP_/, "")
        .replace(/_C$/, "");
    if (parentFile === "MonsterBase" || parentFile === undefined) {
        return section;
    }
    const parentBlueprintSection = getPalBlueprint(parentFile, sectionName);
    if (section === undefined) {
        return parentBlueprintSection;
    }
    if (parentBlueprintSection === undefined) {
        return section;
    }
    // @ts-expect-error -- These are the same shape, don't know why it doesn't like it.
    return deepmerge(parentBlueprintSection, section, {
        arrayMerge: (destinationArray, sourceArray: unknown[]) => sourceArray,
    });
}
