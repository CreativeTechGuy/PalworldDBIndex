import type { JSXElement } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { MinimumSphere } from "./MinimumSphere";
import { Name } from "./Name";
import { PalDescription } from "./PalDescription";

export type CustomFieldProps<Value> = {
    value: Value;
    palData: CombinedData;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customFields: Record<string, (props: CustomFieldProps<any>) => JSXElement> = {
    Name,
    MinimumSphere,
    PalDescription,
};
