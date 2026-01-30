// cspell:words Regene, Syncro
import { pascalCaseToTitleCase } from "./pascalCaseToTitleCase";

const map: Record<string, string> = {
    Electricity: "Electric",
    Earth: "Ground",
    Leaf: "Grass",
    Normal: "Neutral",
    ShotAttack: "Attack",
    Regene: "Regenerate",
    Syncro: "Synchronize",
};

export function mapCellValue(value: string): string {
    value = value.replace(/^[a-z]+::/i, "");
    if (value === "None") {
        return "";
    }
    for (const [source, replacement] of Object.entries(map)) {
        value = value.replaceAll(source, replacement);
    }
    if (value.match(/^[0-9.]+$/) !== null) {
        return (Math.round(parseFloat(value) * 100) / 100).toLocaleString();
    }
    value = pascalCaseToTitleCase(value);
    value = value.replaceAll("_", " ");
    return value;
}
