import { mapWorkSkills } from "./mapWorkSkills";
import { pascalCaseToTitleCase } from "./pascalCaseToTitleCase";

/* eslint-disable @typescript-eslint/naming-convention */
const map: Record<string, string> = {
    ElementType1: "Element 1",
    ElementType2: "Element 2",
    ZukanIndex: "PalBox ID",
    ZukanIndexSuffix: "PalBox ID Suffix",
    ShotAttack: "Attack",
    Friendship_ShotAttack: "Friendship Attack",
    CombatStatTotalWithFriendship: "Combat Stat Total with Max Friendship",
    HpWithFriendship: "Hp with Max Friendship",
    AttackWithFriendship: "Attack with Max Friendship",
    DefenseWithFriendship: "Defense with Max Friendship",
    CaptureRateCorrect: "Capture Rate",
};

export function mapColumnHeader(header: string): string {
    header = mapWorkSkills(header.replace("WorkSuitability_", ""));
    if (header in map) {
        return map[header];
    }
    header = pascalCaseToTitleCase(header);
    header = header.replaceAll("_", " ");
    return header;
}
