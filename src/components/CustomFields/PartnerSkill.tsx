import { createMemo, For, Show, type JSXElement } from "solid-js";
import { FormatTextTags } from "~/components/FormatTextTags";
import { Hover } from "~/components/Hover";
import { getPalBlueprint } from "~/data/palBlueprints";
import partnerSkills from "~/raw_data/Pal/Content/Pal/DataTable/PartnerSkill/DT_PartnerSkill.json";
import passiveSkills from "~/raw_data/Pal/Content/Pal/DataTable/PassiveSkill/DT_PassiveSkill_Main.json";
import attackDataTable from "~/raw_data/Pal/Content/Pal/DataTable/Waza/DT_WazaDataTable.json";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { mapCellValue } from "~/utils/mapCellValue";
import type { CustomFieldProps } from "./customFields";

/* eslint-disable @typescript-eslint/naming-convention */
type PartnerSkillParameterProperties = {
    ActiveSkill_MainValue_Overview_EditorOnly?: string;
    ActiveSkill_MainValueByRank?: number[];
    ActiveSkill_OverWriteCoolTimeByRank?: number[];
};
/* eslint-enable @typescript-eslint/naming-convention */

type PartnerSkillData = {
    name?: string;
    duration?: number;
    power?: number[];
    powerMultiplier?: number[];
    cooldown?: number[];
    element?: string;
};

const targetMapping: Partial<Record<string, "self" | "trainer" | "both" | "basePal" | "base">> = {
    "EPalPassiveSkillEffectTargetType::ToSelf": "self",
    "EPalPassiveSkillEffectTargetType::ToTrainer": "trainer",
    "EPalPassiveSkillEffectTargetType::ToSelfAndTrainer": "both",
    "EPalPassiveSkillEffectTargetType::ToBaseCampPal": "basePal",
    "EPalPassiveSkillEffectTargetType::ToBuildObject": "base",
};

const namePrefix = {
    self: "Pal ",
    trainer: "Trainer ",
    both: "",
    basePal: "Base Pal ",
    base: "",
};

const partnerSkillMap = convertDataTableType(partnerSkills, { partialData: true });
const passiveSkillMap = convertDataTableType(passiveSkills, { partialData: true });
const attackDataList = Object.values(convertDataTableType(attackDataTable));

export function PartnerSkill(props: CustomFieldProps<string>): JSXElement {
    const partnerSkillData = createMemo<PartnerSkillData[]>(() => {
        const data: PartnerSkillData[] = [];
        const partnerSkillComponent = getPalBlueprint(props.palData.Id, "PalPartnerSkillParameter_GEN_VARIABLE");
        if (partnerSkillComponent !== undefined) {
            const attackId = partnerSkillComponent.Properties?.FunnelAttackWazaID;
            const attackEntry: PartnerSkillData = {};
            if (attackId !== undefined) {
                const attackData = attackDataList.find((item) => item.WazaType === attackId);
                if (attackData !== undefined) {
                    attackEntry.power = [attackData.Power];
                    attackEntry.cooldown = [attackData.CoolTime];
                    if (attackData.Element !== "EPalElementType::None") {
                        attackEntry.element = attackData.Element;
                    }
                }
            }
            const partnerSkillId = partnerSkillComponent.Properties?.SkillName;
            if (partnerSkillId !== undefined && partnerSkillId in partnerSkillMap) {
                const properties = partnerSkillComponent.Properties as unknown as PartnerSkillParameterProperties;
                const isMainValueMultiplier =
                    properties.ActiveSkill_MainValue_Overview_EditorOnly?.includes("倍率") === true;
                const skillData = partnerSkillMap[partnerSkillId]!;
                const newData: PartnerSkillData = {
                    ...attackEntry,
                    duration: skillData.EffectTime > 1 ? skillData.EffectTime : undefined,
                    cooldown: [skillData.CoolDownTime],
                };
                if (Array.isArray(properties.ActiveSkill_OverWriteCoolTimeByRank)) {
                    newData.cooldown = properties.ActiveSkill_OverWriteCoolTimeByRank;
                }
                if (!isMainValueMultiplier && Array.isArray(properties.ActiveSkill_MainValueByRank)) {
                    // 威力
                    newData.power = properties.ActiveSkill_MainValueByRank;
                }
                if (isMainValueMultiplier && Array.isArray(properties.ActiveSkill_MainValueByRank)) {
                    // includes: 倍率
                    newData.powerMultiplier = properties.ActiveSkill_MainValueByRank;
                }
                data.push(newData);
            } else if (Object.keys(attackEntry).length > 0) {
                data.push(attackEntry);
            }
            const passiveSkillsByLevel = partnerSkillComponent.Properties?.PassiveSkills;
            if (passiveSkillsByLevel !== undefined) {
                const skills: Record<string, PartnerSkillData> = {};
                for (let level = 0; level < passiveSkillsByLevel.length; level++) {
                    const levelData = passiveSkillsByLevel[level];
                    // eslint-disable-next-line @typescript-eslint/prefer-for-of
                    for (let index = 0; index < levelData.SkillAndParameters.length; index++) {
                        const skill = levelData.SkillAndParameters[index];
                        const passiveSkillData = passiveSkillMap[skill.Key.Key];
                        if (passiveSkillData === undefined) {
                            continue;
                        }
                        for (let i = 1; i <= 3; i++) {
                            const targetType = passiveSkillData[`TargetType${i as 1 | 2 | 3}`];
                            const target = targetMapping[targetType] ?? "none";
                            const effectType = passiveSkillData[`EffectType${i as 1 | 2 | 3}`];
                            if (target === "none" || effectType === "EPalPassiveSkillEffectType::no") {
                                continue;
                            }
                            skills[`${effectType}-${i}`] ??= {};
                            const effectValue = passiveSkillData[`EffectValue${i as 1 | 2 | 3}`];

                            if (target === "trainer") {
                                if (effectType.startsWith("EPalPassiveSkillEffectType::ElementResist")) {
                                    skills[`${effectType}-${i}`].name = "Trainer Resistance Type";
                                    skills[`${effectType}-${i}`].element = effectType.replace(
                                        "EPalPassiveSkillEffectType::ElementResist",
                                        ""
                                    );
                                } else if (effectType.startsWith("EPalPassiveSkillEffectType::Element")) {
                                    skills[`${effectType}-${i}`].name = "Trainer Attack Type";
                                    skills[`${effectType}-${i}`].element = effectType.replace(
                                        "EPalPassiveSkillEffectType::Element",
                                        ""
                                    );
                                    continue;
                                }
                            }
                            skills[`${effectType}-${i}`].element ??=
                                skill.Value.TargetElementType !== "EPalElementType::None"
                                    ? skill.Value.TargetElementType
                                    : undefined;
                            skills[`${effectType}-${i}`].name ??=
                                `${namePrefix[target]}${mapCellValue(effectType.replace("EPalPassiveSkillEffectType::", ""))}`;
                            if (effectValue !== 0) {
                                if (skills[`${effectType}-${i}`].powerMultiplier === undefined) {
                                    skills[`${effectType}-${i}`].powerMultiplier = Array.from<number>({
                                        length: level,
                                    }).fill(1);
                                }
                                skills[`${effectType}-${i}`].powerMultiplier!.push(effectValue / 100 + 1);
                            }
                        }
                    }
                }
                data.push(...Object.values(skills).filter((skill) => Object.keys(skill).length > 1));
            }
        }
        return data;
    });
    return (
        <Hover label={props.value}>
            {partnerSkillData().length === 0 ? (
                <FormatTextTags text={props.palData.PalDescription} />
            ) : (
                <>
                    <FormatTextTags text={props.palData.PalDescription} />
                    <br />
                    <For each={partnerSkillData()}>
                        {(skill) => (
                            <>
                                <br />
                                <table class="table-cell-padding">
                                    <tbody>
                                        <Show when={skill.name}>
                                            {(name) => (
                                                <tr>
                                                    <td colSpan={2}>{name()}</td>
                                                </tr>
                                            )}
                                        </Show>
                                        <Show when={skill.duration}>
                                            {(duration) => (
                                                <tr>
                                                    <td>Effect duration</td>
                                                    <td>{duration()}s</td>
                                                </tr>
                                            )}
                                        </Show>
                                        <Show when={skill.element}>
                                            {(element) => (
                                                <tr>
                                                    <td>Element</td>
                                                    <td>{mapCellValue(element())}</td>
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
                </>
            )}
        </Hover>
    );
}
