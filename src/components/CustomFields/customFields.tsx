import type { JSXElement } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { Element } from "./Element";
import { ItemDrops } from "./ItemDrops";
import { MinimumSphere } from "./MinimumSphere";
import { Name } from "./Name";
import { PalDescription } from "./PalDescription";
import { PartnerSkill } from "./PartnerSkill";
import { PassiveSkill } from "./PassiveSkill";
import { SpawnLocations } from "./SpawnLocations";

export type CustomFieldProps<Value> = {
    value: Value;
    palData: CombinedData;
    updateData: (newData: CombinedData) => void;
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
};
