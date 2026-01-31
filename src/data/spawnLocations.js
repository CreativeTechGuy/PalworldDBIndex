// @ts-nocheck -- Don't try to infer the type of this file since it's too large
import spawnerPlacementData from "~/raw_data/Pal/Content/Pal/DataTable/Spawner/DT_PalSpawnerPlacement.json";
import spawnLocations from "~/raw_data/Pal/Content/Pal/DataTable/UI/DT_PaldexDistributionData.json";
import { convertDataTableType } from "~/utils/convertDataTableType";

/**
 * @type {typeof import("../types/SpawnLocations.ts").SpawnData}
 */
export const spawnLocationMap = convertDataTableType(spawnLocations);
/**
 * @type {typeof import("../types/SpawnLocations.ts").SpawnerData}
 */
export const spawnerLocationMap = convertDataTableType(spawnerPlacementData);
