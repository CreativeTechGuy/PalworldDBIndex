import { createSignal, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { rootElement } from "~/config/rootElement";
import { resetSphereSettings, setSphereSettings, sphereSettings } from "~/config/sphereSettings";
import { resetColumnSettings, setUserColumnSettings, userColumnSettings } from "~/config/tableColumns";
import { configurableColumns } from "~/data/orderedColumns";
import settingsIcon from "~/icons/settings.svg";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { Dialog } from "./Dialog";
import { MultiSelectList } from "./MultiSelectList";

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
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan={2} class="center">
                                        Pal Sphere Capture Settings
                                    </th>
                                </tr>
                                <tr>
                                    <td>Pal Health Remaining</td>
                                    <td>
                                        <input
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
                                    <td>Min Capture Chance Acceptable</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
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
                                    <td>Include Back Bonus</td>
                                    <td>
                                        <input
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
                                    <td>Statue of Power Level</td>
                                    <td>
                                        <input
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
                                    <td>World Setting Capture Rate</td>
                                    <td>
                                        <input
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
                                    <td>Sphere Module Capture Strength</td>
                                    <td>
                                        <input
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
                                    <td>Auto-hide non-unique columns</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={userColumnSettings().autoHideRedundantColumns}
                                            onInput={(evt) => {
                                                setUserColumnSettings((current) => ({
                                                    ...current,
                                                    autoHideRedundantColumns: evt.target.checked,
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <ColumnConfigurationRow type="columnsFirst" label="Move columns to front" />
                                <ColumnConfigurationRow type="columnsLast" label="Move columns to end" />
                                <ColumnConfigurationRow type="hidden" label="Hide columns" />
                                <tr>
                                    <td colSpan={2} class="center">
                                        <button
                                            class="link-button"
                                            onClick={() => {
                                                resetSphereSettings();
                                                resetColumnSettings();
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

type ColumnConfigurationRowProps = {
    label: string;
    type: Exclude<keyof ReturnType<typeof userColumnSettings>, "autoHideRedundantColumns">;
};

function ColumnConfigurationRow(props: ColumnConfigurationRowProps): JSXElement {
    return (
        <tr>
            <td>
                {props.label}
                <br />({userColumnSettings()[props.type].length} Selected)
                <br />
                <button
                    class="link-button"
                    onClick={() => {
                        // eslint-disable-next-line solid/reactivity
                        setUserColumnSettings((current) => ({
                            ...current,
                            [props.type]: [],
                        }));
                    }}
                >
                    Clear Selection
                </button>
            </td>
            <td>
                <MultiSelectList
                    options={configurableColumns.map((columnName) => ({
                        label: mapColumnHeader(columnName),
                        value: columnName,
                    }))}
                    selected={userColumnSettings()[props.type]}
                    onChange={(selected) => {
                        const propsType = props.type;
                        setUserColumnSettings((current) => {
                            return {
                                ...current,
                                columnsFirst: [...current.columnsFirst].filter((column) => !selected.includes(column)),
                                columnsLast: [...current.columnsLast].filter((column) => !selected.includes(column)),
                                hidden: [...current.hidden].filter((column) => !selected.includes(column)),
                                [propsType]: selected,
                            };
                        });
                    }}
                />
            </td>
        </tr>
    );
}
