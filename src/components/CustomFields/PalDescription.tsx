import type { JSXElement } from "solid-js";
import { FormatTextTags } from "~/components/FormatTextTags";
import type { CustomFieldProps } from "./customFields";

export function PalDescription(props: CustomFieldProps<string>): JSXElement {
    return (
        <div>
            <FormatTextTags text={props.value} palId={props.palData.Id} oneLine={true} />
        </div>
    );
}
