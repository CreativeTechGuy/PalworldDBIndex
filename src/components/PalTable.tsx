import { createSignal, For, type JSXElement } from "solid-js";
import { columns, rows, setRows } from "~/data/palCombinedData";
import { mapCellValue } from "~/utils/mapCellValue";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { CustomField } from "./CustomField";

const sorter = new Intl.Collator(undefined, {
    numeric: true,
});

export function PalTable(): JSXElement {
    const [lastSortedColumn, setLastSortedColumn] = createSignal("none");
    const [lastSortDirectionDown, setLastSortDirectionDown] = createSignal(true);
    return (
        <table class="pal-table">
            <thead>
                <For each={columns}>
                    {(columnName) => (
                        <th
                            onClick={() => {
                                if (lastSortedColumn() === columnName) {
                                    setRows((current) => [...current.reverse()]);
                                } else {
                                    let multiplier = 1;
                                    if (typeof rows()[0][columnName] === "number") {
                                        multiplier = -1;
                                    }
                                    setRows((current) =>
                                        current.toSorted((a, b) => {
                                            const aValue = a[columnName];
                                            const bValue = b[columnName];
                                            const isValueAEmpty = mapCellValue(aValue.toString()) === "";
                                            const isValueBEmpty = mapCellValue(bValue.toString()) === "";
                                            if (isValueAEmpty && !isValueBEmpty) {
                                                return 1;
                                            }
                                            if (isValueBEmpty && !isValueAEmpty) {
                                                return -1;
                                            }
                                            return sorter.compare(aValue.toString(), bValue.toString()) * multiplier;
                                        })
                                    );
                                }
                                if (lastSortedColumn() === columnName) {
                                    setLastSortDirectionDown((current) => !current);
                                } else {
                                    setLastSortDirectionDown(true);
                                }
                                setLastSortedColumn(columnName);
                            }}
                        >
                            {mapColumnHeader(columnName)}
                            <br />
                            <span
                                aria-hidden={lastSortedColumn() !== columnName}
                                style={{ visibility: lastSortedColumn() !== columnName ? "hidden" : "visible" }}
                            >
                                {lastSortDirectionDown() ? "▼" : "▲"}
                            </span>
                        </th>
                    )}
                </For>
            </thead>
            <tbody>
                <For each={rows()}>
                    {(palData) => (
                        <tr>
                            <For each={columns}>
                                {(columnName) => (
                                    <td>
                                        <CustomField property={columnName} palData={palData} />
                                    </td>
                                )}
                            </For>
                        </tr>
                    )}
                </For>
            </tbody>
        </table>
    );
}
