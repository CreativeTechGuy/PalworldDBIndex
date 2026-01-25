import { createSignal, createUniqueId, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { filterSettings, resetFilterSettings, setFilterSettings } from "~/config/filter";
import { rootElement } from "~/config/rootElement";
import { visibleColumns } from "~/config/visibleColumns";
import { rows } from "~/data/palCombinedData";
import filterIcon from "~/icons/filter.svg";
import { mapCellValue } from "~/utils/mapCellValue";
import { Dialog } from "./Dialog";

export function Filter(): JSXElement {
    const [open, setOpen] = createSignal(false);
    const sortSelectedToTopId = createUniqueId();
    const filterRowsId = createUniqueId();
    return (
        <>
            <button
                class="link-button floating-button"
                title="Filter rows"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <img style={{ height: "100%" }} src={filterIcon} alt="Filter icon" />
            </button>
            {open() && (
                <Portal mount={rootElement}>
                    <Dialog
                        title="Filter rows"
                        onClose={() => {
                            setOpen(false);
                        }}
                    >
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label for={sortSelectedToTopId}>Move highlighted rows to top</label>
                                    </td>
                                    <td>
                                        <input
                                            id={sortSelectedToTopId}
                                            type="checkbox"
                                            checked={filterSettings().sortSelectedToTop}
                                            onChange={(evt) => {
                                                setFilterSettings((current) => ({
                                                    ...current,
                                                    sortSelectedToTop: evt.target.checked,
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for={filterRowsId}>Filter rows</label>
                                    </td>
                                    <td>
                                        <input
                                            id={filterRowsId}
                                            type="search"
                                            value={filterSettings().filterText}
                                            onInput={(evt) => {
                                                const matchingRowIds: string[] = [];
                                                const searchString = evt.target.value.toLowerCase().trim();
                                                for (const row of rows()) {
                                                    const isMatching = visibleColumns().some((column) =>
                                                        mapCellValue(row[column].toString())
                                                            .toLowerCase()
                                                            .includes(searchString)
                                                    );
                                                    if (isMatching) {
                                                        matchingRowIds.push(row.Id);
                                                    }
                                                }
                                                setFilterSettings((current) => ({
                                                    ...current,
                                                    filterText: evt.target.value,
                                                    filterMatchingRowIds: matchingRowIds,
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan={2} class="center">
                                        <button
                                            class="link-button"
                                            onClick={() => {
                                                resetFilterSettings();
                                            }}
                                        >
                                            Clear all filters and highlights
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Dialog>
                </Portal>
            )}
        </>
    );
}
