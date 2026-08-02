// cspell:words Yakushima
import { createMemo, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import palIconMapping from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalCharacterIconDataTable.json";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";
import type { CustomFieldProps } from "./customFields";

const iconMapping = palIconMapping[0].Rows;

export function Name(props: CustomFieldProps<string, { Id: string }>): JSXElement {
    const url = createMemo(() => {
        const iconData = getObjectByCaseInsensitiveKey(iconMapping, props.palData.Id)!;
        const assetPathName = iconData.Icon.AssetPathName.replace("/Game/Pal/Texture/PalIcon/Normal/", "")
            .split(".")
            .at(0)!;
        if (assetPathName.startsWith("Yakushima/")) {
            return new URL(
                `../../raw_data/Pal/Content/Pal/Texture/PalIcon/Normal/Yakushima/${assetPathName.replace("Yakushima/", "")}.png`,
                import.meta.url
            ).href;
        }
        return new URL(`../../raw_data/Pal/Content/Pal/Texture/PalIcon/Normal/${assetPathName}.png`, import.meta.url)
            .href;
    });
    return (
        <Hover label={props.value} title={props.value}>
            <img src={url()} alt={`${props.value} icon`} style={{ width: "150px", height: "150px" }} />
        </Hover>
    );
}
