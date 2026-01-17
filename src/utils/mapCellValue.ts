import { pascalCaseToTitleCase } from "./pascalCaseToTitleCase";

export function mapCellValue(value: string): string {
    value = value.replace(/^[a-z]+::/i, "");
    if (value === "None") {
        return "";
    }
    if (value.match(/^[0-9]+$/) !== null) {
        return parseInt(value, 10).toLocaleString();
    }
    value = pascalCaseToTitleCase(value);
    value = value.replaceAll("_", " ");
    return value;
}
