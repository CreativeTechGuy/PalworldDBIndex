// cspell:ignore Loaction

import { globSync, cpSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

type SteamAPIResponse = {
    events: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        event_name: string;
    }[];
};

const patterns = [
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_ItemDescriptionText_Common.json",
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json",
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_MapObjectNameText_Common.json",
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json",
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_PalNameText_Common.json",
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillDescText_Common.json",
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText_Common.json",
    "Pal/Content/L10N/en/Pal/DataTable/Text/DT_UI_Common_Text_Common.json",
    "Pal/Content/Pal/Blueprint/Character/Monster/PalActorBP/*/BP_*.json",
    "Pal/Content/Pal/Blueprint/RaidBoss/DT_PalRaidBoss.json",
    "Pal/Content/Pal/Blueprint/System/BP_PalGameSetting.json",
    "Pal/Content/Pal/DataTable/Character/DT_PalCharacterIconDataTable.json",
    "Pal/Content/Pal/DataTable/Character/DT_PalCombiUnique.json",
    "Pal/Content/Pal/DataTable/Character/DT_PalDropItem.json",
    "Pal/Content/Pal/DataTable/Character/DT_PalMonsterParameter.json",
    "Pal/Content/Pal/DataTable/PartnerSkill/DT_PartnerSkill.json",
    "Pal/Content/Pal/DataTable/PassiveSkill/DT_PassiveSkill_Main.json",
    "Pal/Content/Pal/DataTable/Spawner/DT_PalSpawnerPlacement.json",
    "Pal/Content/Pal/DataTable/Spawner/DT_PalWildSpawner.json",
    "Pal/Content/Pal/DataTable/Technology/DT_TechnologyRecipeUnlock.json",
    "Pal/Content/Pal/DataTable/Waza/DT_WazaDataTable.json",
    "Pal/Content/Pal/DataTable/WorldMapUIData/DT_WorldMapUIData.json",
    "Pal/Content/Pal/Texture/PalIcon/Normal/**",
    "Pal/Content/Pal/Texture/UI/Map/T_WorldMap.png",
];
const destinationDir = "src/raw_data";

const exportedFilesPath = process.argv[2];
console.log("Copying from:", exportedFilesPath);

for (const pattern of patterns) {
    const matchedFiles = globSync(pattern, {
        cwd: exportedFilesPath,
    });
    if (matchedFiles.length === 0) {
        throw new Error(`Didn't find required file: ${pattern}`);
    }
    for (const file of matchedFiles) {
        cpSync(join(exportedFilesPath, file), join(destinationDir, file), { force: true, recursive: true });
    }
}

const steamPatchNotesJSON = (await fetch(
    "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=1623730&count_before=0&count_after=1"
).then((res) => res.json())) as SteamAPIResponse;

const newVersion = steamPatchNotesJSON.events[0].event_name.match(/v([0-9.]+)/)![1];

const envFile = readFileSync(".env", "utf-8");
console.log("New version: ", newVersion);
writeFileSync(".env", envFile.replace(/^GAME_VERSION=(.*?)$/m, `GAME_VERSION=${newVersion}`));
