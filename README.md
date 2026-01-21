**This site is in no way associated with or endorsed by Pocket Pair, Inc.**

Notes

- Items:
    - Names:
        - Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json
    - Description:
        - Content/L10N/en/Pal/DataTable/Text/DT_ItemDescriptionText_Common.json
    - Monster Drops:
        - Content/Pal/DataTable/Character/DT_PalDropItem.json
- Pals:
    - Names:
        - Content/L10N/en/Pal/DataTable/Text/DT_PalNameText_Common.json
    - Description:
        - Content/L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json
    - Basic Stats:
        - Content/Pal/DataTable/Character/DT_PalMonsterParameter.json
    - Spawn Locations:
        - Pal/Content/Pal/DataTable/UI/DT_PaldexDistributionData.json
        - Content/Pal/Texture/UI/Map/T_WorldMap.png
        - Coordinate translation:
            - Content/Pal/DataTable/WorldMapUIData/DT_WorldMapUIData.json
    - Breeding Data:
        - Content/Pal/DataTable/Character/DT_PalCombiUnique.json
        - https://palworld.wiki.gg/wiki/Breeding#How_Breeding_Works
    - Icon:
        - Content/Pal/DataTable/Character/DT_PalCharacterIconDataTable.json
        - Content/Pal/Texture/PalIcon/Normal/\*.png
- Skills:
    - Names:
        - Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText_Common.json
    - Description:
        - Content/L10N/en/Pal/DataTable/Text/DT_SkillDescText_Common.json
    - Active:
        - Content/Pal/DataTable/Waza/DT_WazaMasterLevel.json
    - Partner Skills:
        - Description:
            - Content/L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json
    - Manually activated skills:
        - Content/Pal/DataTable/PartnerSkill/DT_PartnerSkill.json
    - Passive skills:
        - Content/Pal/DataTable/PassiveSkill/DT_PassiveSkill_Main.json
    - Mapping:
        - Content/Pal/Blueprint/Character/Monster/PalActorBP/\*/\*.json
            - Type = "PalPartnerSkillParameterComponent"
            - Requirement Item: Properties.RestrictionItems[0].Key
    - Unlock Level from:
        - Content/Pal/DataTable/Technology/DT_TechnologyRecipeUnlock.json
        - Properties.PassiveSkills (array if passive, each item of the array is the levels of the skill, look this up in DT_PassiveSkill_Main)
        - Properties.SkillName (string if active, look this up in DT_PartnerSkill)
        - Damage/similar is ActiveSkill_MainValueByRank
        - Cooldown is ActiveSkill_OverWriteCoolTimeByRank
    - Basic Stats:
        - Content/Pal/DataTable/Waza/DT_WazaDataTable.json

Figure out how to get version number??
https://steamdb.info/api/PatchnotesRSS/?appid=1623730

https://github.com/CrystalFerrai/Ue4Export
https://github.com/joric/CUE4Parse.CLI/wiki

https://gridjs.io/
