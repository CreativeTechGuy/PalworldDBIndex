import { createSignal, createUniqueId, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { rootElement } from "~/config/rootElement";
import { resetSphereSettings, setSphereSettings, sphereSettings } from "~/config/sphereSettings";
import { unconfigurableColumns } from "~/config/tableColumns";
import { resetTableSort } from "~/config/tableSort";
import { resetColumnSettings, setUserColumnSettings, userColumnSettings } from "~/config/userColumns";
import settingsIcon from "~/icons/settings.svg";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { Dialog } from "./Dialog";
import { DragAndDropList } from "./DragAndDropList";

export function Settings(): JSXElement {
    const [open, setOpen] = createSignal(false);
    const healthRemainingId = createUniqueId();
    const minCaptureRateAcceptableId = createUniqueId();
    const isBackId = createUniqueId();
    const lifmunkLevelId = createUniqueId();
    const worldSettingCaptureRateId = createUniqueId();
    const sphereModuleCaptureStrengthId = createUniqueId();
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
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan={2} class="center">
                                        Pal Sphere Capture Settings
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        <label for={healthRemainingId}>Pal Health Remaining</label>
                                    </td>
                                    <td>
                                        <input
                                            id={healthRemainingId}
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="10"
                                            style={{ width: "3em" }}
                                            value={Math.round(sphereSettings().healthRemaining * 100)}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    healthRemaining: parseInt(evt.target.value, 10) / 100,
                                                }));
                                            }}
                                        />
                                        %
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for={minCaptureRateAcceptableId}>Min Capture Chance Acceptable</label>
                                    </td>
                                    <td>
                                        <input
                                            id={minCaptureRateAcceptableId}
                                            type="number"
                                            min="1"
                                            max="100"
                                            step="1"
                                            style={{ width: "3em" }}
                                            value={Math.round(sphereSettings().minCaptureRateAcceptable * 100)}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    minCaptureRateAcceptable: parseInt(evt.target.value, 10) / 100,
                                                }));
                                            }}
                                        />
                                        %
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for={isBackId}>Include Back Bonus</label>
                                    </td>
                                    <td>
                                        <input
                                            id={isBackId}
                                            type="checkbox"
                                            checked={sphereSettings().isBack}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    isBack: evt.target.checked,
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for={lifmunkLevelId}>Statue of Power Level</label>
                                    </td>
                                    <td>
                                        <input
                                            id={lifmunkLevelId}
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="1"
                                            style={{ width: "3em" }}
                                            value={sphereSettings().lifmunkLevel}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    lifmunkLevel: parseInt(evt.target.value, 10),
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for={worldSettingCaptureRateId}>World Setting Capture Rate</label>
                                    </td>
                                    <td>
                                        <input
                                            id={worldSettingCaptureRateId}
                                            type="number"
                                            min="0.5"
                                            max="2"
                                            step="0.5"
                                            style={{ width: "3em" }}
                                            value={sphereSettings().worldSettingCaptureRate}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    worldSettingCaptureRate: parseFloat(evt.target.value),
                                                }));
                                            }}
                                        />
                                        x
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for={sphereModuleCaptureStrengthId}>
                                            Sphere Module Capture Strength
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            id={sphereModuleCaptureStrengthId}
                                            type="number"
                                            min="0"
                                            step="1"
                                            style={{ width: "3em" }}
                                            value={sphereSettings().sphereModuleCaptureStrength}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    sphereModuleCaptureStrength: parseInt(evt.target.value, 10),
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
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

// type ColumnConfigurationRowProps = {
//     label: string;
//     type: Exclude<keyof ReturnType<typeof userColumnSettings>, "autoHideRedundantColumns">;
// };

// function ColumnConfigurationRow(props: ColumnConfigurationRowProps): JSXElement {
//     return (
//         <tr>
//             <td>
//                 {props.label}
//                 <br />({userColumnSettings()[props.type].length} Selected)
//                 <br />
//                 <button
//                     class="link-button"
//                     onClick={() => {
//                         // eslint-disable-next-line solid/reactivity
//                         setUserColumnSettings((current) => ({
//                             ...current,
//                             [props.type]: [],
//                         }));
//                     }}
//                 >
//                     Clear Selection
//                 </button>
//             </td>
//             <td>
//                 <MultiSelectList
//                     options={configurableColumns.map((columnName) => ({
//                         label: mapColumnHeader(columnName),
//                         value: columnName,
//                     }))}
//                     selected={userColumnSettings()[props.type]}
//                     onChange={(selected) => {
//                         const propsType = props.type;
//                         setUserColumnSettings((current) => {
//                             return {
//                                 ...current,
//                                 columnsFirst: [...current.columnsFirst].filter((column) => !selected.includes(column)),
//                                 columnsLast: [...current.columnsLast].filter((column) => !selected.includes(column)),
//                                 hidden: [...current.hidden].filter((column) => !selected.includes(column)),
//                                 [propsType]: selected,
//                             };
//                         });
//                     }}
//                 />
//             </td>
//         </tr>
//     );
// }
