// cspell:words MAPOBJECT
import { createMemo, For, type JSXElement } from "solid-js";
import itemNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json";
import mapObjectNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_MapObjectNameText_Common.json";
import characterNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_PalNameText_Common.json";
import skillNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText_Common.json";
import uiNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_UI_Common_Text_Common.json";
import { convertDataTableType } from "~/utils/convertDataTableType";

type FormatTextTagsProps = {
    text: string;
    interpolationData?: Record<string, string | number | boolean>;
    oneLine?: boolean;
};

const itemNamesMap = convertDataTableType(itemNames);
const mapNamesMap = convertDataTableType(mapObjectNames);
const uiNamesMap = convertDataTableType(uiNames);
const skillNamesMap = convertDataTableType(skillNames);
const characterNamesMap = convertDataTableType(characterNames);

export function FormatTextTags(props: FormatTextTagsProps): JSXElement {
    const replacedStringParts = createMemo(() => {
        const lines = replaceInString(props.text, props.interpolationData).split("\r\n");
        if (props.oneLine === true) {
            return [lines.join(" ")];
        }
        return lines.flatMap((x) => [<br />, x]).slice(1);
    });
    return <For each={replacedStringParts()}>{(str) => str}</For>;
}

function replaceInString(str: string, data?: Record<string, string | number | boolean>): string {
    str = str.replace(/<itemName id=\|(\w+)\|\/>/gi, (match, id) => {
        return itemNamesMap[`ITEM_NAME_${id}`].TextData.LocalizedString;
    });
    str = str.replace(/<mapObjectName id=\|(\w+)\|\/>/gi, (match, id) => {
        return mapNamesMap[`MAPOBJECT_NAME_${id}`].TextData.LocalizedString;
    });
    str = str.replace(/<uiCommon id=\|(\w+)\|\/>/gi, (match, id: string) => {
        return uiNamesMap[id].TextData.LocalizedString;
    });
    str = str.replace(/<activeSkillName id=\|(\w+)\|\/>/gi, (match, id) => {
        return skillNamesMap[`ACTION_SKILL_${id}`].TextData.LocalizedString;
    });
    str = str.replace(/<characterName id=\|(\w+)\|\/>/gi, (match, id) => {
        return characterNamesMap[`PAL_NAME_${id}`].TextData.LocalizedString;
    });
    str = str.replace(/<Num(Red|Blue)_13>(.+)<\/>/gi, "$2");
    if (data !== undefined) {
        str = str.replace(/{(\w+)}/g, (match, id: string) => {
            return data[id].toString();
        });
    }
    if (str.includes("id=|")) {
        throw new Error(`String tag not replaced: ${str}`);
    }
    if (str.match(/{\w+}/) !== null) {
        throw new Error(`String variable not interpolated: ${str}`);
    }
    return str;
}
