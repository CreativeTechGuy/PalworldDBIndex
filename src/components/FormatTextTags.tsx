// cspell:words MAPOBJECT
import { createMemo, For, type JSXElement } from "solid-js";
import { partnerSkillParametersMap as partnerSkillParametersMapRaw } from "~/data/partnerSkillParameters";
import itemNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json";
import mapObjectNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_MapObjectNameText_Common.json";
import skillNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText_Common.json";
import uiNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_UI_Common_Text_Common.json";
import passiveSkills from "~/raw_data/Pal/Content/Pal/DataTable/PassiveSkill/DT_PassiveSkill_Main.json";
import type { PartnerSkillParameters } from "~/types/PartnerSkillParameters";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";
import { getPalName } from "~/utils/getPalName";

type FormatTextTagsProps = {
    palId: string;
    text: string;
    oneLine?: boolean;
};

const itemNamesMap = convertDataTableType(itemNames);
const mapNamesMap = convertDataTableType(mapObjectNames);
const uiNamesMap = convertDataTableType(uiNames);
const skillNamesMap = convertDataTableType(skillNames);
const passiveSkillMap = convertDataTableType(passiveSkills, { partialData: true });
const partnerSkillParametersMap = partnerSkillParametersMapRaw as PartnerSkillParameters;

export function FormatTextTags(props: FormatTextTagsProps): JSXElement {
    const replacedStringParts = createMemo(() => {
        const lines = replaceInString(props.text, props.palId).split("\r\n");
        if (props.oneLine === true) {
            return [lines.join(" ")];
        }
        return lines.flatMap((x) => [<br />, x]).slice(1);
    });
    return <For each={replacedStringParts()}>{(str) => str}</For>;
}

function getPassiveEffectValues(id: string, palId: string): string {
    const skillParameters = getObjectByCaseInsensitiveKey(partnerSkillParametersMap, palId);
    const isReferencePassive = id.includes("ReferencePassive");
    const passiveIndex = parseInt(id.match(/Passive(\d)/)![1], 10);
    const effectValueIndex = parseInt(id.match(/EffectValue(\d)/)![1], 10);
    const passiveSkillNames = isReferencePassive
        ? skillParameters!.TextReferencePassiveSkills.map(
              (levelSkills) => levelSkills.PassiveSkillIds[passiveIndex - 1].Key
          )
        : skillParameters!.PassiveSkills.map(
              (levelSkills) => levelSkills.SkillAndParametersArray[passiveIndex - 1].SkillName.Key
          );
    const values = passiveSkillNames.map((passiveName) => {
        const passiveSkillData = passiveSkillMap[passiveName]!;
        const value = passiveSkillData[`EffectValue${effectValueIndex as 1 | 2 | 3 | 4}`];
        return value;
    });
    if (values.every((value) => value === values[0])) {
        return values[0].toString();
    }
    return `(${values.join(" → ")})`;
}

function replaceInString(str: string, palId: string): string {
    str = str.replace(
        /<Status_Up>(.*?){(\w+)}(.*?)<\/>/gi,
        (match, prefix: string | undefined, id: string, postfix: string | undefined) => {
            const skillParameters = getObjectByCaseInsensitiveKey(partnerSkillParametersMap, palId);
            if (id === "ActiveSkillMainValueByRank") {
                return `${prefix ?? ""}(${skillParameters!.ActiveSkill.ActiveSkill_MainValueByRank.join(" → ")})${postfix ?? ""}`;
            }
            if (id === "ActiveSkillOverWriteCoolTimeByRank") {
                return `${prefix ?? ""}(${skillParameters!.ActiveSkill.ActiveSkill_OverWriteCoolTimeByRank.join(" → ")})${postfix ?? ""}`;
            }
            if (id === "ActiveSkillOverWriteEffectTime") {
                return `${prefix ?? ""}(${skillParameters!.ActiveSkill.ActiveSkill_OverWriteEffectTimeByRank.join(" → ")})${postfix ?? ""}`;
            }
            return `${prefix ?? ""}${getPassiveEffectValues(id, palId)}${postfix ?? ""}`;
        }
    );
    str = str.replace(
        /(.){(ReferencePassive\w+)}(.)/gi,
        (match, prefix: string | undefined, id: string, postfix: string | undefined) => {
            return `${prefix ?? ""}${getPassiveEffectValues(id, palId)}${postfix ?? ""}`;
        }
    );
    str = str.replace(
        /(.){(Passive\w+)}(.)/gi,
        (match, prefix: string | undefined, id: string, postfix: string | undefined) => {
            return `${prefix ?? ""}${getPassiveEffectValues(id, palId)}${postfix ?? ""}`;
        }
    );
    str = str.replace(
        /<Status_Keyword>(.*?){?([a-z0-9-_ ]+)}?(.*?)<\/>/gi,
        (match, prefix: string | undefined, id: string, postfix: string | undefined) => {
            return `${prefix ?? ""}${id}${postfix ?? ""}`;
        }
    );
    str = str.replace(/<img id=\|(\w+)\|\/>/gi, "");
    str = str.replace(/<uiCommon id=\|(\w+)\|.*?\/>/gi, (match, id: string) => {
        return uiNamesMap[id].TextData.LocalizedString;
    });
    str = str.replace(/<characterName id=\|(\w+)\|.*?\/>/gi, (match, id: string) => {
        return getPalName(id)!;
    });
    str = str.replace(/{ReferenceMsgId_.*?}/gi, "");
    str = str.replace(/<itemName id=\|(\w+)\|.*?\/>/gi, (match, id) => {
        return getObjectByCaseInsensitiveKey(itemNamesMap, `ITEM_NAME_${id}`)!.TextData.LocalizedString;
    });
    str = str.replace(/<activeSkillName id=\|(\w+)\|.*?\/>/gi, (match, id) => {
        return skillNamesMap[`ACTION_SKILL_${id}`].TextData.LocalizedString;
    });
    str = str.replace(/<mapObjectName id=\|(\w+)\|.*?\/>/gi, (match, id) => {
        return mapNamesMap[`MAPOBJECT_NAME_${id}`].TextData.LocalizedString;
    });
    return str;
}
