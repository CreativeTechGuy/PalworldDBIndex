import { type JSXElement } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { CombinedData } from "~/data/palCombinedData";
import { mapCellValue } from "~/utils/mapCellValue";
import { customFields } from "./CustomFields/customFields";

type CustomFieldProps = {
    property: keyof CombinedData;
    palData: CombinedData;
};

export function CustomField(props: CustomFieldProps): JSXElement {
    return (
        <>
            {props.property in customFields ? (
                <Dynamic
                    component={customFields[props.property]}
                    value={props.palData[props.property]}
                    palData={props.palData}
                />
            ) : (
                <span>{mapCellValue(props.palData[props.property].toString())}</span>
            )}
        </>
    );
}
