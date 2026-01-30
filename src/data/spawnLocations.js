// @ts-nocheck -- Don't try to infer the type of this file since it's too large
import spawnerPlacementData from "~/raw_data/Pal/Content/Pal/DataTable/Spawner/DT_PalSpawnerPlacement.json";
import { convertDataTableType } from "~/utils/convertDataTableType";

/**
 * @type {typeof import("../types/SpawnLocations.ts").SpawnerData}
 */
export const spawnerLocationMap = convertDataTableType(spawnerPlacementData);
