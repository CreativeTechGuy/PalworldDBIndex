import wildPalsStats from "~/raw_data/Pal/Content/Pal/DataTable/Spawner/DT_PalWildSpawner.json";
import type { SpawnerData } from "~/types/SpawnLocations";
import { spawnerLocationMap } from "./spawnLocations";

const spawnerLocations = Object.values(spawnerLocationMap as SpawnerData);
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
            }[];
        }
    >
> = {};

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
                palSpawners[pal].spawnPoints.push({
                    X: location.Location.X,
                    Y: location.Location.Y,
                    Radius: location.StaticRadius,
                    MinLevel: spawn[`LvMin_${typedIndex}`],
                    MaxLevel: spawn[`LvMax_${typedIndex}`],
                    NightOnly: spawn.OnlyTime === "EPalOneDayTimeType::Night",
                    Dungeon: location.PlacementType.startsWith("EPalSpawnerPlacementType::Dungeon"),
                });
            }
        }
    }
}

export { maxWildPalLevel, palSpawners };
