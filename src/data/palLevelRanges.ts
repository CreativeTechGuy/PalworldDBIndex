import wildPalsStats from "~/raw_data/Pal/Content/Pal/DataTable/Spawner/DT_PalWildSpawner.json";

let maxWildPalLevel = 0;
const palLevelRanges: Record<string, { min: number; max: number }> = {};
for (const spawn of Object.values(wildPalsStats[0].Rows)) {
    const maxLevel = Math.max(spawn.LvMax_1, spawn.LvMax_2, spawn.LvMax_3);
    maxWildPalLevel = Math.max(maxLevel, maxWildPalLevel);
    for (let i = 1; i <= 3; i++) {
        const typedIndex = i as 1 | 2 | 3;
        const pal = spawn[`Pal_${typedIndex}`].replace("BOSS_", "");
        if (pal === "None") {
            continue;
        }
        palLevelRanges[pal] ??= { min: 999, max: 0 };
        palLevelRanges[pal].min = Math.min(palLevelRanges[pal].min, spawn[`LvMin_${typedIndex}`]);
        palLevelRanges[pal].max = Math.max(palLevelRanges[pal].max, spawn[`LvMax_${typedIndex}`]);
    }
}

export { maxWildPalLevel, palLevelRanges };
