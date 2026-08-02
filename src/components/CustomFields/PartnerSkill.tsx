import { createMemo, For, Show, type JSXElement } from "solid-js";
import { FormatTextTags } from "~/components/FormatTextTags";
import { Hover } from "~/components/Hover";
import { partnerSkillParametersMap as partnerSkillParametersMapRaw } from "~/data/partnerSkillParameters";
import partnerSkills from "~/raw_data/Pal/Content/Pal/DataTable/PartnerSkill/DT_PartnerSkill.json";
import type { PartnerSkillParameters } from "~/types/PartnerSkillParameters";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";
// import { mapWorkSkills } from "~/utils/mapWorkSkills";
import type { CustomFieldProps } from "./customFields";

type PartnerSkillData = {
    duration?: number;
    power?: number[];
    powerMultiplier?: number[];
    cooldown?: number[];
};

const partnerSkillMap = convertDataTableType(partnerSkills, { partialData: true });
const partnerSkillParametersMap = partnerSkillParametersMapRaw as PartnerSkillParameters;

export function PartnerSkill(props: CustomFieldProps<string>): JSXElement {
    const partnerSkillData = createMemo<PartnerSkillData[]>(() => {
        const data: PartnerSkillData[] = [];
        const skillParameters = getObjectByCaseInsensitiveKey(partnerSkillParametersMap, props.palData.Id);
        if (skillParameters !== undefined) {
            if (
                skillParameters.ActiveSkill.SkillName !== "Unknown" &&
                skillParameters.ActiveSkill.SkillName !== "None"
            ) {
                const activeSkillData = getObjectByCaseInsensitiveKey(
                    partnerSkillMap,
                    skillParameters.ActiveSkill.SkillName
                )!;
                const isMainValueMultiplier =
                    skillParameters.ActiveSkill.ActiveSkill_MainValue_Overview_EditorOnly.includes("倍率");
                const newData: PartnerSkillData = {
                    duration: activeSkillData.EffectTime > 1 ? activeSkillData.EffectTime : undefined,
                    cooldown: [activeSkillData.CoolDownTime],
                };
                if (skillParameters.ActiveSkill.ActiveSkill_OverWriteCoolTimeByRank.length > 0) {
                    newData.cooldown = skillParameters.ActiveSkill.ActiveSkill_OverWriteCoolTimeByRank;
                }
                if (!isMainValueMultiplier && skillParameters.ActiveSkill.ActiveSkill_MainValueByRank.length > 0) {
                    // 威力
                    newData.power = skillParameters.ActiveSkill.ActiveSkill_MainValueByRank;
                }
                if (isMainValueMultiplier && skillParameters.ActiveSkill.ActiveSkill_MainValueByRank.length > 0) {
                    // includes: 倍率
                    newData.powerMultiplier = skillParameters.ActiveSkill.ActiveSkill_MainValueByRank;
                }
                data.push(newData);
            }
        }
        return data;
    });
    return (
        <Hover label={props.value} title={props.value}>
            {partnerSkillData().length === 0 ? (
                <div style={{ "max-width": "min(30rem, 80vw)" }}>
                    <FormatTextTags text={props.palData.PalDescription} palId={props.palData.Id} oneLine={true} />
                </div>
            ) : (
                <div style={{ "max-width": "min-content" }}>
                    <div>
                        <FormatTextTags text={props.palData.PalDescription} palId={props.palData.Id} oneLine={true} />
                    </div>
                    <For each={partnerSkillData()}>
                        {(skill) => (
                            <>
                                <br />
                                <table
                                    class="table-cell-padding"
                                    style={{ "text-wrap": "nowrap", "min-width": "15rem" }}
                                >
                                    <tbody>
                                        <Show when={skill.duration}>
                                            {(duration) => (
                                                <tr>
                                                    <td>Effect duration</td>
                                                    <td>{duration()}s</td>
                                                </tr>
                                            )}
                                        </Show>
                                        <Show when={skill.power}>
                                            {(power) => (
                                                <tr>
                                                    <td>Power</td>
                                                    <td>{power().join(" → ")}</td>
                                                </tr>
                                            )}
                                        </Show>
                                        <Show when={skill.powerMultiplier}>
                                            {(multiplier) => (
                                                <tr>
                                                    <td>Multiplier</td>
                                                    <td>
                                                        {multiplier()
                                                            .map((value) => `${Math.round(value * 100)}%`)
                                                            .join(" → ")}
                                                    </td>
                                                </tr>
                                            )}
                                        </Show>
                                        <Show when={skill.cooldown}>
                                            {(cooldown) => (
                                                <tr>
                                                    <td>Cooldown</td>
                                                    <td>
                                                        {cooldown()
                                                            .map((time) => `${time}s`)
                                                            .join(" → ")}
                                                    </td>
                                                </tr>
                                            )}
                                        </Show>
                                    </tbody>
                                </table>
                            </>
                        )}
                    </For>
                </div>
            )}
        </Hover>
    );
}
