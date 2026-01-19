import { createMemo, For, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import { getPalItemDrops } from "~/data/getPalItemDrops";
import itemNames from "~/raw_data/DT_ItemNameText_Common.json";
import { convertDataTableType } from "~/utils/convertDataTableType";
import type { CustomFieldProps } from "./customFields";

const itemNameMap = convertDataTableType(itemNames);

export function ItemDrops(props: CustomFieldProps<string>): JSXElement {
    const itemDrops = createMemo(() => getPalItemDrops(props.palData.Id));
    return (
        <Hover label={<div>{props.value}</div>}>
            <table>
                <tbody>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Chance</th>
                    </tr>
                    <For each={itemDrops()}>
                        {(item) => (
                            <tr>
                                <td>{itemNameMap[`ITEM_NAME_${item.Id}`].TextData.LocalizedString}</td>
                                {item.Min === item.Max ? (
                                    <td>{item.Min}</td>
                                ) : (
                                    <td>
                                        {item.Min} - {item.Max}
                                    </td>
                                )}
                                <td>{item.Rate}%</td>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </Hover>
    );
}
