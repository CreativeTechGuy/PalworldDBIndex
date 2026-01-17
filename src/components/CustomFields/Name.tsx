// cspell:words Yakushima
import { createMemo, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import palIconMapping from "~/raw_data/DT_PalCharacterIconDataTable.json";
import type { CustomFieldProps } from "./customFields";

// Some of the keys aren't the same case sensitivity as their IDs elsewhere, so normalize the key casing
const iconMapping = Object.fromEntries(
    Object.entries(palIconMapping[0].Rows).map(([key, value]) => [
        key.toLowerCase(),
        value.Icon.AssetPathName.replace("/Game/Pal/Texture/PalIcon/Normal/", "").split(".").at(0),
    ])
);

export function Name(props: CustomFieldProps<string>): JSXElement {
    const url = createMemo(() => {
        const assetPathName = iconMapping[props.palData.Id.toLowerCase()]!;
        if (assetPathName.startsWith("Yakushima/")) {
            return new URL(
                `../../raw_data/icons/Yakushima/${assetPathName.replace("Yakushima/", "")}.png`,
                import.meta.url
            ).href;
        }
        return new URL(`../../raw_data/icons/${assetPathName}.png`, import.meta.url).href;
    });
    return (
        <Hover label={props.value.trim()}>
            <img src={url()} alt={`${props.value.trim()} icon`} style={{ width: "150px", height: "150px" }} />
        </Hover>
    );
}
