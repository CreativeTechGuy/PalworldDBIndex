import fishLotteryDataTable from "~/raw_data/Pal/Content/Pal/DataTable/Fishing/DT_PalFishingSpotLotteryDataTable.json";
import fishShadowDataTable from "~/raw_data/Pal/Content/Pal/DataTable/Fishing/DT_PalFishShadowDataTable.json";
import wildPalsStats from "~/raw_data/Pal/Content/Pal/DataTable/Spawner/DT_PalWildSpawner.json";
import worldMapScaleData from "~/raw_data/Pal/Content/Pal/DataTable/WorldMapUIData/DT_WorldMapUIData.json";
import type { SpawnData, SpawnerData } from "~/types/SpawnLocations";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { isPointInRect } from "~/utils/isPointInRect";
import { spawnerLocationMap, spawnLocationMap } from "./spawnLocations";

const spawnPointData = spawnLocationMap as SpawnData;
const fishLotteryData = Object.values(convertDataTableType(fishLotteryDataTable));
const fishShadowData = convertDataTableType(fishShadowDataTable);
const spawnerLocations = Object.values(spawnerLocationMap as SpawnerData);
const worldMapScale = worldMapScaleData[0].Rows;
let maxWildPalLevel = 0;
const palSpawners: Partial<
    Record<
        string,
        {
            min: number;
            max: number;
            spawnPoints: {
                X: number;
                Y: number;
                Radius: number;
                MinLevel: number;
                MaxLevel: number;
                NightOnly: boolean;
                Dungeon: boolean;
                Fishing: boolean;
                Map: "main" | "tree";
            }[];
        }
    >
> = {};
const nightOnlyValue = "EPalOneDayTimeType::Night";
const seenPoints = new Set<string>();
const seenPointRoundFactor = Math.round(15000 / 2);
for (const spawn of Object.values(wildPalsStats[0].Rows)) {
    const maxLevel = Math.max(spawn.LvMax_1, spawn.LvMax_2, spawn.LvMax_3);
    maxWildPalLevel = Math.max(maxLevel, maxWildPalLevel);
    for (let i = 1; i <= 3; i++) {
        const typedIndex = i as 1 | 2 | 3;
        const pal = spawn[`Pal_${typedIndex}`].replace(/^BOSS_/i, "");
        if (pal.startsWith("PREDATOR_")) {
            continue;
        }
        if (pal === "None") {
            continue;
        }
        const locations = spawnerLocations.filter((item) => item.SpawnerName === spawn.SpawnerName);
        if (locations.length > 0) {
            palSpawners[pal] ??= { min: 999, max: 0, spawnPoints: [] };
            palSpawners[pal].min = Math.min(palSpawners[pal].min, spawn[`LvMin_${typedIndex}`]);
            palSpawners[pal].max = Math.max(palSpawners[pal].max, spawn[`LvMax_${typedIndex}`]);

            for (const location of locations) {
                const seenPointKey = `${pal}-${Math.round(location.Location.X / seenPointRoundFactor)}-${Math.round(location.Location.Y / seenPointRoundFactor)}`;
                if (seenPoints.has(seenPointKey)) {
                    continue;
                }
                seenPoints.add(seenPointKey);
                palSpawners[pal].spawnPoints.push({
                    X: location.Location.X,
                    Y: location.Location.Y,
                    Radius: location.StaticRadius,
                    MinLevel: spawn[`LvMin_${typedIndex}`],
                    MaxLevel: spawn[`LvMax_${typedIndex}`],
                    NightOnly: spawn.OnlyTime === nightOnlyValue,
                    Dungeon: location.PlacementType.startsWith("EPalSpawnerPlacementType::Dungeon"),
                    Fishing: false,
                    Map: isInMap(worldMapScale.MainMap, location.Location) ? "main" : "tree",
                });
            }
        }
    }
}

for (const [fishShadowId, fishShadow] of Object.entries(fishShadowData)) {
    const lotteryData = fishLotteryData.filter((item) => item.FishShadowId === fishShadowId);
    const pal = fishShadow.PalId;
    const spawnPoints = spawnPointData[pal];
    const locations: { X: number; Y: number }[] = [];
    let nightOnly = true;
    // 8000 is the radius for pals obtained from fishing
    if (spawnPoints?.dayTimeLocations.Radius === 8000) {
        locations.push(...spawnPoints.dayTimeLocations.Locations);
        nightOnly = false;
    }
    if (spawnPoints?.nightTimeLocations.Radius === 8000) {
        locations.push(...spawnPoints.nightTimeLocations.Locations);
    }
    if (locations.length === 0) {
        continue;
    }
    palSpawners[pal] ??= { min: 999, max: 0, spawnPoints: [] };
    for (const lotteryItem of lotteryData) {
        palSpawners[pal].min = Math.min(palSpawners[pal].min, lotteryItem.MinLevel);
        palSpawners[pal].max = Math.max(palSpawners[pal].max, lotteryItem.MaxLevel);
    }
    for (const dayLocation of locations) {
        const seenPointKey = `${pal}-${Math.round(dayLocation.X / seenPointRoundFactor)}-${Math.round(dayLocation.Y / seenPointRoundFactor)}`;
        if (seenPoints.has(seenPointKey)) {
            continue;
        }
        seenPoints.add(seenPointKey);
        palSpawners[pal].spawnPoints.push({
            X: dayLocation.X,
            Y: dayLocation.Y,
            Radius: 8000,
            MinLevel: 0,
            MaxLevel: 0,
            Dungeon: false,
            Fishing: true,
            NightOnly: nightOnly,
            Map: isInMap(worldMapScale.MainMap, dayLocation) ? "main" : "tree",
        });
    }
}

export { maxWildPalLevel, palSpawners };

function isInMap(mapData: typeof worldMapScale.MainMap, point: { X: number; Y: number }): boolean {
    return isPointInRect(point, {
        min: mapData.landScapeRealPositionMin,
        max: mapData.landScapeRealPositionMax,
    });
}
