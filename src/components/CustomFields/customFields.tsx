import type { JSXElement } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { Breeding } from "./Breeding";
import { Element } from "./Element";
import { ItemDrops } from "./ItemDrops";
import { MinimumSphere } from "./MinimumSphere";
import { Name } from "./Name";
import { NoMapCellValue } from "./NoMapCellValue";
import { PalDescription } from "./PalDescription";
import { PartnerSkill } from "./PartnerSkill";
import { PassiveSkill } from "./PassiveSkill";
import { Rideable } from "./Rideable";
import { SpawnLocations } from "./SpawnLocations";

export type CustomFieldProps<Value, PalData = CombinedData> = {
    value: Value;
    palData: PalData;
    updateData: PalData extends CombinedData ? (newData: CombinedData) => void : undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customFields: Record<string, (props: CustomFieldProps<any>) => JSXElement> = {
    Name,
    MinimumSphere,
    PalDescription,
    PassiveSkill1: PassiveSkill,
    PassiveSkill2: PassiveSkill,
    PartnerSkill,
    ItemDrops,
    SpawnLocations,
    ElementType1: Element,
    ElementType2: Element,
    Id: NoMapCellValue,
    Tribe: NoMapCellValue,
    BPClass: NoMapCellValue,
    GenusCategory: NoMapCellValue,
    AIResponse: NoMapCellValue,
    Breeding,
    Rideable,
};
