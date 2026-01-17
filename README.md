Notes

- Items:
    - Names:
        - Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json
    - Description:
        - Content/L10N/en/Pal/DataTable/Text/DT_ItemDescriptionText_Common.json
    - Monster Drops: (Priority)
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
    - Active: (Priority)
        - Content/Pal/DataTable/Waza/DT_WazaMasterLevel.json
    - Partner Skills: (Priority)
        - Description:
            - Content/L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json
    - Manually activated skills: (Priority)
        - Content/Pal/DataTable/PartnerSkill/DT_PartnerSkill.json
    - Passive skills: (Priority)
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
        - Cool down is ActiveSkill_OverWriteCoolTimeByRank
    - Basic Stats:
        - Content/Pal/DataTable/Waza/DT_WazaDataTable.json

Figure out how to get version number??
https://steamdb.info/app/2394010/patchnotes/

https://github.com/CrystalFerrai/Ue4Export
https://github.com/joric/CUE4Parse.CLI/wiki

https://gridjs.io/
