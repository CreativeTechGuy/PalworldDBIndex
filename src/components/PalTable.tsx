import {
    createEffect,
    createRenderEffect,
    createSignal,
    For,
    on,
    onMount,
    runWithOwner,
    type JSXElement,
} from "solid-js";
import { filterSettings, setFilterSettings } from "~/config/filter";
import { loadOrDefault } from "~/config/loadOrDefault";
import { unsortableColumns } from "~/config/tableColumns";
import { columnOrder } from "~/data/orderedColumns";
import { rows, setRows } from "~/data/palCombinedData";
import { arrayIncludes } from "~/utils/arrayIncludes";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { mapCellValue } from "~/utils/mapCellValue";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { CustomField } from "./CustomField";

const sorter = new Intl.Collator(undefined, {
    numeric: true,
});

const fieldDefaultSortAscending = new Map<string, boolean>();

const [lastSortedColumn, setLastSortedColumn] = createSignal<ReturnType<typeof columnOrder>[number] | "none">(
    loadOrDefault("table-sort-column", "none")
);
const [lastSortDirectionAscending, setLastSortDirectionAscending] = createSignal(
    loadOrDefault<string>("table-sort-direction-ascending", "true") === "true"
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        localStorage.setItem("table-sort-column", lastSortedColumn());
        localStorage.setItem("table-sort-direction-ascending", lastSortDirectionAscending().toString());
    });
});

export function PalTable(): JSXElement {
    const [initialized, setInitialized] = createSignal(false);
    onMount(() => {
        // Wait for any display text to get replaced by their respective components
        window.requestAnimationFrame(() => {
            for (const columnName of columnOrder()) {
                for (const row of rows()) {
                    if (mapCellValue(row[columnName].toString()) === "") {
                        continue;
                    } else if (
                        typeof row[columnName] === "number" ||
                        row[columnName].toString().match(/^[0-9]+$/) !== null ||
                        arrayIncludes(["true", "false"], row[columnName])
                    ) {
                        fieldDefaultSortAscending.set(columnName, false);
                        break;
                    }
                    fieldDefaultSortAscending.set(columnName, true);
                    break;
                }
            }
            sortColumn();
            setInitialized(true);
        });
    });
    createRenderEffect<string[]>(
        on([lastSortedColumn, lastSortDirectionAscending, filterSettings], (_, prev) => {
            if (!initialized()) {
                return [];
            }
            const lastHighlightedRows = prev?.[0] ?? [];
            if (lastHighlightedRows.length !== filterSettings().highlightedRowIds.length) {
                setTimeout(() => {
                    sortColumn();
                }, 500);
            } else {
                sortColumn();
            }
            return filterSettings().highlightedRowIds;
        }),
        []
    );
    function sortColumn(): void {
        const columnName = lastSortedColumn();
        if (columnName === "none") {
            return;
        }
        const multiplier = lastSortDirectionAscending() ? 1 : -1;
        const highlights = filterSettings().highlightedRowIds;
        const sortSelectedToTop = filterSettings().sortSelectedToTop;

        setRows((current) =>
            current.toSorted((a, b) => {
                const aValue = a[columnName];
                const bValue = b[columnName];
                const isValueAEmpty = ["", "N/A"].includes(mapCellValue(aValue.toString()));
                const isValueBEmpty = ["", "N/A"].includes(mapCellValue(bValue.toString()));
                if (sortSelectedToTop) {
                    const isValueAHighlighted = highlights.includes(a.Id);
                    const isValueBHighlighted = highlights.includes(b.Id);
                    if (isValueAHighlighted && !isValueBHighlighted) {
                        return -1;
                    }
                    if (!isValueAHighlighted && isValueBHighlighted) {
                        return 1;
                    }
                }
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
    return (
        <table class="pal-table">
            <thead>
                <For each={columnOrder()}>
                    {(columnName) => (
                        <th
                            class={unsortableColumns.includes(columnName) ? "no-sort" : undefined}
                            onClick={() => {
                                if (unsortableColumns.includes(columnName)) {
                                    return;
                                }
                                if (lastSortedColumn() === columnName) {
                                    setLastSortDirectionAscending((current) => !current);
                                } else {
                                    setLastSortDirectionAscending(fieldDefaultSortAscending.get(columnName) === true);
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
                                {lastSortDirectionAscending() ? "▲" : "▼"}
                            </span>
                        </th>
                    )}
                </For>
            </thead>
            <tbody>
                <For each={rows()}>
                    {(palData, index) => (
                        <tr
                            class={filterSettings().highlightedRowIds.includes(palData.Id) ? "highlight" : undefined}
                            style={{
                                display:
                                    filterSettings().filterMatchingRowIds?.includes(palData.Id) !== false
                                        ? undefined
                                        : "none",
                            }}
                            onClick={function (this: HTMLTableRowElement, evt) {
                                const composedPath = evt.composedPath();
                                if (
                                    !composedPath.includes(this) ||
                                    composedPath.some((elem) => elem instanceof HTMLButtonElement)
                                ) {
                                    return;
                                }
                                if (filterSettings().highlightedRowIds.includes(palData.Id)) {
                                    setFilterSettings((current) => ({
                                        ...current,
                                        highlightedRowIds: current.highlightedRowIds.filter(
                                            (item) => item !== palData.Id
                                        ),
                                    }));
                                } else {
                                    setFilterSettings((current) => ({
                                        ...current,
                                        highlightedRowIds: [...current.highlightedRowIds, palData.Id],
                                    }));
                                }
                            }}
                        >
                            <For each={columnOrder()}>
                                {(columnName) => (
                                    <td>
                                        <CustomField
                                            property={columnName}
                                            palData={palData}
                                            updateData={(newData: typeof palData) => {
                                                const i = index();
                                                setRows((current) => {
                                                    return [...current.slice(0, i), newData, ...current.slice(i + 1)];
                                                });
                                            }}
                                        />
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
