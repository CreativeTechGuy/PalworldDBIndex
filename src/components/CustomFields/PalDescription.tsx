import type { JSXElement } from "solid-js";
import { FormatTextTags } from "~/components/FormatTextTags";
import type { CustomFieldProps } from "./customFields";

export function PalDescription(props: CustomFieldProps<string>): JSXElement {
    return (
        <div class="one-line-text">
            <FormatTextTags text={props.palData.PalDescription} ignoreLineBreaks={true} />
        </div>
    );
}
