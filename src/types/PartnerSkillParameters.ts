/* eslint-disable @typescript-eslint/naming-convention */
export type PartnerSkillParameters = Partial<
    Record<
        string,
        {
            ActiveSkill: {
                SkillName: string;
                ActiveSkill_MainValueByRank: number[];
                ActiveSkill_OverWriteCoolTimeByRank: number[];
                ActiveSkill_OverWriteEffectTimeByRank: number[];
                ActiveSkill_MainValue_Overview_EditorOnly: string;
            };
            PassiveSkills: {
                SkillAndParametersArray: {
                    SkillName: {
                        Key: string;
                    };
                }[];
            }[];
            TextReferencePassiveSkills: {
                PassiveSkillIds: {
                    Key: string;
                }[];
            }[];
        }
    >
>;
