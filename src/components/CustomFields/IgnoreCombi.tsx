import { createMemo, For, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import { rows } from "~/data/palCombinedData";
import palCombinationData from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalCombiUnique.json";
import { convertDataTableType } from "~/utils/convertDataTableType";
import type { CustomFieldProps } from "./customFields";

const combinations = Object.values(convertDataTableType(palCombinationData));
const anyGender = "EPalGenderType::None";
const male = "EPalGenderType::Male";

export function IgnoreCombi(props: CustomFieldProps<boolean>): JSXElement {
    const palCombinations = createMemo(() =>
        combinations.filter(
            (combi) =>
                combi.ChildCharacterID === props.palData.Id &&
                (combi.ParentTribeA !== props.palData.Tribe || combi.ParentTribeB !== props.palData.Tribe)
        )
    );

    return (
        <>
            {palCombinations().length > 0 && (
                <Hover label={props.value ? "Exclusive Combinations" : "Additional Combinations"}>
                    <table>
                        <For each={palCombinations()}>
                            {(combi) => {
                                return (
                                    <tr>
                                        <td>
                                            {rows().find((pal) => pal.Tribe === combi.ParentTribeA)?.Name}
                                            <FormatGender gender={combi.ParentGenderA} />
                                        </td>
                                        <td>+</td>
                                        <td>
                                            {rows().find((pal) => pal.Tribe === combi.ParentTribeB)?.Name}
                                            <FormatGender gender={combi.ParentGenderB} />
                                        </td>
                                    </tr>
                                );
                            }}
                        </For>
                    </table>
                </Hover>
            )}
        </>
    );
}

function FormatGender(props: { gender: string }): JSXElement {
    return <>{props.gender !== anyGender && (props.gender === male ? " (M)" : " (F)")}</>;
}
