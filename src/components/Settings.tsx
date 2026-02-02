import { createSignal, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { rootElement } from "~/config/rootElement";
import { resetSphereSettings } from "~/config/sphereSettings";
import { unconfigurableColumns } from "~/config/tableColumns";
import { resetTableSort } from "~/config/tableSort";
import { resetColumnSettings, setUserColumnSettings, userColumnSettings } from "~/config/userColumns";
import settingsIcon from "~/icons/settings.svg";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { Dialog } from "./Dialog";
import { DragAndDropList } from "./DragAndDropList";

export function Settings(): JSXElement {
    const [open, setOpen] = createSignal(false);
    return (
        <>
            <button
                class="link-button floating-button"
                title="Settings"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <img style={{ height: "100%" }} src={settingsIcon} alt="Settings icon" />
            </button>
            {open() && (
                <Portal mount={rootElement}>
                    <Dialog
                        title="Settings"
                        onClose={() => {
                            setOpen(false);
                        }}
                    >
                        {/* Currently unused since the formula is incorrect. <SphereCaptureSettings /> */}
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan={2}>Columns</th>
                                </tr>
                                <tr>
                                    <td>Reorder/hide columns</td>
                                    <td>
                                        <DragAndDropList
                                            style={{ height: "10rem", "overflow-y": "auto", width: "max-content" }}
                                            items={userColumnSettings()
                                                .columnOrder.filter((column) => !unconfigurableColumns.includes(column))
                                                .map((column) => ({
                                                    value: column,
                                                    label: (
                                                        <>
                                                            <input
                                                                type="checkbox"
                                                                checked={!userColumnSettings().hidden.includes(column)}
                                                                onChange={(evt) => {
                                                                    if (!evt.target.checked) {
                                                                        setUserColumnSettings((current) => {
                                                                            return {
                                                                                ...current,
                                                                                hidden: [...current.hidden, column],
                                                                            };
                                                                        });
                                                                    } else {
                                                                        setUserColumnSettings((current) => {
                                                                            return {
                                                                                ...current,
                                                                                hidden: current.hidden.filter(
                                                                                    (item) => item !== column
                                                                                ),
                                                                            };
                                                                        });
                                                                    }
                                                                }}
                                                            />{" "}
                                                            {mapColumnHeader(column)}
                                                        </>
                                                    ),
                                                }))}
                                            onChange={(newList) => {
                                                setUserColumnSettings((current) => ({
                                                    ...current,
                                                    columnOrder: [
                                                        ...unconfigurableColumns,
                                                        ...newList.map((item) => item.value),
                                                    ],
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                {/* <ColumnConfigurationRow type="hidden" label="Hide columns" /> */}
                                <tr>
                                    <td colSpan={2} class="center">
                                        <button
                                            class="link-button"
                                            onClick={() => {
                                                resetSphereSettings();
                                                resetColumnSettings();
                                                resetTableSort();
                                            }}
                                        >
                                            Reset all settings
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
