import { createMemo, type JSXElement } from "solid-js";
import { FormatTextTags } from "~/components/FormatTextTags";
import { Hover } from "~/components/Hover";
import skillDescriptions from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillDescText_Common.json";
import skillNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText_Common.json";
import passiveSkills from "~/raw_data/Pal/Content/Pal/DataTable/PassiveSkill/DT_PassiveSkill_Main.json";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { mapCellValue } from "~/utils/mapCellValue";
import type { CustomFieldProps } from "./customFields";

const skillNameMap = convertDataTableType(skillNames);
const skillDescriptionMap = convertDataTableType(skillDescriptions, { partialData: true });
const passiveSkillMap = convertDataTableType(passiveSkills, { partialData: true });

export function PassiveSkill(props: CustomFieldProps<string>): JSXElement {
    const skillData = createMemo(() => passiveSkillMap[props.value]);
    const skillDescriptionKey = createMemo(() =>
        `PASSIVE_${props.value}` in skillDescriptionMap
            ? `PASSIVE_${props.value}`
            : skillData() !== undefined && skillData()!.OverrideDescMsgID in skillDescriptionMap
              ? skillData()!.OverrideDescMsgID
              : "None"
    );
    return (
        <>
            {`PASSIVE_${props.value}` in skillNameMap ? (
                <Hover label={skillNameMap[`PASSIVE_${props.value}`].TextData.LocalizedString}>
                    {skillDescriptionKey() in skillDescriptionMap ? (
                        <FormatTextTags
                            interpolationData={skillData()}
                            text={skillDescriptionMap[skillDescriptionKey()]!.TextData.LocalizedString}
                        />
                    ) : (
                        skillData() !== undefined && (
                            <table>
                                <tbody>
                                    {skillData()!.EffectValue1 !== 0 && (
                                        <tr>
                                            <td>{mapCellValue(skillData()!.EffectType1)}</td>
                                            <td>{skillData()!.EffectValue1}%</td>
                                            <td>{mapCellValue(skillData()!.TargetType1)}</td>
                                        </tr>
                                    )}
                                    {skillData()!.EffectValue2 !== 0 && (
                                        <tr>
                                            <td>{mapCellValue(skillData()!.EffectType2)}</td>
                                            <td>{skillData()!.EffectValue2}%</td>
                                            <td>{mapCellValue(skillData()!.TargetType2)}</td>
                                        </tr>
                                    )}
                                    {skillData()!.EffectValue3 !== 0 && (
                                        <tr>
                                            <td>{mapCellValue(skillData()!.EffectType3)}</td>
                                            <td>{skillData()!.EffectValue3}%</td>
                                            <td>{mapCellValue(skillData()!.TargetType3)}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )
                    )}
                </Hover>
            ) : (
                ""
            )}
        </>
    );
}
