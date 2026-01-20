import { createMemo, type JSXElement } from "solid-js";
import { FormatTextTags } from "~/components/FormatTextTags";
import { Hover } from "~/components/Hover";
import { getPalBlueprint } from "~/data/palBlueprints";
import partnerSkills from "~/raw_data/DT_PartnerSkill.json";
import { convertDataTableType } from "~/utils/convertDataTableType";
import type { CustomFieldProps } from "./customFields";

/* eslint-disable @typescript-eslint/naming-convention */
type PartnerSkillParameterProperties = {
    ActiveSkill_MainValue_Overview_EditorOnly?: string;
    ActiveSkill_MainValueByRank?: number[];
    ActiveSkill_OverWriteCoolTimeByRank?: number[];
};
/* eslint-enable @typescript-eslint/naming-convention */

const partnerSkillMap = convertDataTableType(partnerSkills);

export function PartnerSkill(props: CustomFieldProps<string>): JSXElement {
    const partnerSkillData = createMemo(() => {
        const partnerSkillComponent = getPalBlueprint(props.palData.Id, "PalPartnerSkillParameter_GEN_VARIABLE");
        if (partnerSkillComponent !== undefined) {
            const partnerSkillId = partnerSkillComponent.Properties?.SkillName;
            if (partnerSkillId !== undefined && partnerSkillId in partnerSkillMap) {
                const properties = partnerSkillComponent.Properties as unknown as PartnerSkillParameterProperties;
                const isMainValueMultiplier =
                    properties.ActiveSkill_MainValue_Overview_EditorOnly?.includes("倍率") === true;
                return {
                    skillData: partnerSkillMap[partnerSkillId],
                    byRank: {
                        CoolDownTime: properties.ActiveSkill_OverWriteCoolTimeByRank ?? [],
                        Power: !isMainValueMultiplier ? (properties.ActiveSkill_MainValueByRank ?? []) : [], // 威力
                        PowerMultiplier: isMainValueMultiplier ? (properties.ActiveSkill_MainValueByRank ?? []) : [], // includes: 倍率
                    },
                };
            }
        }
        return undefined;
    });
    return (
        <Hover label={props.value}>
            {partnerSkillData() === undefined ? (
                <FormatTextTags text={props.palData.PalDescription} />
            ) : (
                <>
                    <FormatTextTags text={props.palData.PalDescription} />
                    <table>
                        <tbody>
                            <tr>
                                <td>Effect duration</td>
                                <td>{partnerSkillData()!.skillData.EffectTime}s</td>
                            </tr>
                            {partnerSkillData()!.byRank.Power.length > 0 && (
                                <tr>
                                    <td>Power</td>
                                    <td>{partnerSkillData()!.byRank.Power.join(" → ")}</td>
                                </tr>
                            )}
                            {partnerSkillData()!.byRank.PowerMultiplier.length > 0 && (
                                <tr>
                                    <td>Power Multiplier</td>
                                    <td>
                                        {partnerSkillData()!
                                            .byRank.PowerMultiplier.map((multiplier) => `${multiplier}x`)
                                            .join(" → ")}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td>Cooldown time</td>
                                {partnerSkillData()!.byRank.CoolDownTime.length > 0 ? (
                                    <td>
                                        {partnerSkillData()!
                                            .byRank.CoolDownTime.map((time) => `${time}s`)
                                            .join(" → ")}
                                    </td>
                                ) : (
                                    <td>{partnerSkillData()!.skillData.CoolDownTime}s</td>
                                )}
                            </tr>
                            <tr>
                                <td>Stamina cost (start)</td>
                                <td>{partnerSkillData()!.skillData.ExecCost}</td>
                            </tr>
                            <tr>
                                <td>Stamina cost (ongoing)</td>
                                <td>{partnerSkillData()!.skillData.IdleCost}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
        </Hover>
    );
}
