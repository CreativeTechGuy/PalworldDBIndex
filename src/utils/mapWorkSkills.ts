import uiNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_UI_Common_Text_Common.json";
import { convertDataTableType } from "./convertDataTableType";

const uiNamesMap = convertDataTableType(uiNames);

export function mapWorkSkills(value: string): string {
    if (`COMMON_WORK_SUITABILITY_${value}` in uiNamesMap) {
        return uiNamesMap[`COMMON_WORK_SUITABILITY_${value}`].TextData.LocalizedString;
    }
    if (`COMMON_WORK_TYPE_${value}` in uiNamesMap) {
        return uiNamesMap[`COMMON_WORK_TYPE_${value}`].TextData.LocalizedString;
    }
    return value;
}
