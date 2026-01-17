// cspell:words MAPOBJECT
import { createMemo, For, type JSXElement } from "solid-js";
import itemNames from "~/raw_data/DT_ItemNameText_Common.json";
import mapObjectNames from "~/raw_data/DT_MapObjectNameText_Common.json";
import characterNames from "~/raw_data/DT_PalNameText_Common.json";
import skillNames from "~/raw_data/DT_SkillNameText_Common.json";
import uiNames from "~/raw_data/DT_UI_Common_Text_Common.json";

type FormatTextTagsProps = {
    text: string;
    ignoreLineBreaks?: boolean;
};

const itemNamesMap = itemNames[0].Rows;
const mapNamesMap = mapObjectNames[0].Rows;
const uiNamesMap = uiNames[0].Rows;
const skillNamesMap = skillNames[0].Rows;
const characterNamesMap = characterNames[0].Rows;

export function FormatTextTags(props: FormatTextTagsProps): JSXElement {
    const replacedStringParts = createMemo(() => {
        const lines = replaceInString(props.text).split("\r\n");
        if (props.ignoreLineBreaks === true) {
            return [lines.join(" ")];
        }
        return lines.flatMap((x) => [<br />, x]).slice(1);
    });
    return <For each={replacedStringParts()}>{(str) => str}</For>;
}

function replaceInString(str: string): string {
    str = str.replace(/<itemName id=\|(\w+)\|\/>/gi, (match, id) => {
        return itemNamesMap[`ITEM_NAME_${id}` as keyof typeof itemNamesMap].TextData.LocalizedString;
    });
    str = str.replace(/<mapObjectName id=\|(\w+)\|\/>/gi, (match, id) => {
        return mapNamesMap[`MAPOBJECT_NAME_${id}` as keyof typeof mapNamesMap].TextData.LocalizedString;
    });
    str = str.replace(/<uiCommon id=\|(\w+)\|\/>/gi, (match, id) => {
        return uiNamesMap[id as keyof typeof uiNamesMap].TextData.LocalizedString;
    });
    str = str.replace(/<activeSkillName id=\|(\w+)\|\/>/gi, (match, id) => {
        return skillNamesMap[`ACTION_SKILL_${id}` as keyof typeof skillNamesMap].TextData.LocalizedString;
    });
    str = str.replace(/<characterName id=\|(\w+)\|\/>/gi, (match, id) => {
        return characterNamesMap[`PAL_NAME_${id}` as keyof typeof characterNamesMap].TextData.LocalizedString;
    });
    if (str.includes("id=|")) {
        throw new Error(`String tag not replaced: ${str}`);
    }
    return str;
}
