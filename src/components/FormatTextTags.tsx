// cspell:words MAPOBJECT
import { createMemo, For, type JSXElement } from "solid-js";
import itemNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json";
import mapObjectNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_MapObjectNameText_Common.json";
import skillNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText_Common.json";
import uiNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_UI_Common_Text_Common.json";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";
import { getPalName } from "~/utils/getPalName";

type FormatTextTagsProps = {
    text: string;
    oneLine?: boolean;
};

const itemNamesMap = convertDataTableType(itemNames);
const mapNamesMap = convertDataTableType(mapObjectNames);
const uiNamesMap = convertDataTableType(uiNames);
const skillNamesMap = convertDataTableType(skillNames);

export function FormatTextTags(props: FormatTextTagsProps): JSXElement {
    const replacedStringParts = createMemo(() => {
        const lines = replaceInString(props.text).split("\r\n");
        if (props.oneLine === true) {
            return [lines.join(" ")];
        }
        return lines.flatMap((x) => [<br />, x]).slice(1);
    });
    return <For each={replacedStringParts()}>{(str) => str}</For>;
}

function replaceInString(str: string): string {
    str = str.replace(
        /<Status_Up>(.*?){(\w+)}(.*?)<\/>/gi,
        (match, prefix: string | undefined, id: string, postfix: string | undefined) => {
            return `${prefix ?? ""}${id}${postfix ?? ""}`;
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
    // str = str.replace(/{ReferenceMsgId_.*?}/gi, "");
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
