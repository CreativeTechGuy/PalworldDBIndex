import deepmerge from "deepmerge";
import type PalBlueprintType1 from "~/raw_data/PalActorBP/PoseidonOrca/BP_PoseidonOrca.json";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";

type PalBlueprintType = typeof PalBlueprintType1;

export const palBlueprints: Record<string, PalBlueprintType> = import.meta.glob(
    ["~/raw_data/PalActorBP/*/BP_*.json", "!~/raw_data/PalActorBP/*/BP_*_BOSS*.json"],
    { eager: true, import: "default" }
);

export function getPalBlueprint(id: string, sectionName: string): PalBlueprintType[number] | undefined {
    const blueprint =
        getObjectByCaseInsensitiveKey(palBlueprints, `/src/raw_data/PalActorBP/${id.split("_")[0]}/BP_${id}.json`) ??
        getObjectByCaseInsensitiveKey(
            palBlueprints,
            `/src/raw_data/PalActorBP/${id.split("_")[0]}/BP_${id}_Normal.json`
        );
    const section = blueprint?.find((item) => item.Name === sectionName);
    if (section === undefined) {
        return undefined;
    }
    const parentPath = section.Template?.ObjectName.match(/'(.*?)'/)?.[1];
    const parentFile = parentPath?.split(":")[0].replace("Default__BP_", "").replace(/_C$/, "");
    if (parentFile === "MonsterBase" || parentFile === undefined) {
        return section;
    }
    const parentSectionName = parentPath!.split(":")[1];
    const parentBlueprintSection = getPalBlueprint(parentFile, parentSectionName);
    if (parentBlueprintSection === undefined) {
        return section;
    }
    // @ts-expect-error -- These are the same shape, don't know why it doesn't like it.
    return deepmerge(parentBlueprintSection, section);
}
