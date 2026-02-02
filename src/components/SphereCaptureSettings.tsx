import { createUniqueId, type JSXElement } from "solid-js";
import { setSphereSettings, sphereSettings } from "~/config/sphereSettings";

export function SphereCaptureSettings(): JSXElement {
    const healthRemainingId = createUniqueId();
    const minCaptureRateAcceptableId = createUniqueId();
    const isBackId = createUniqueId();
    const lifmunkLevelId = createUniqueId();
    const worldSettingCaptureRateId = createUniqueId();
    const sphereModuleCaptureStrengthId = createUniqueId();
    return (
        <table style={{ width: "100%" }}>
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
                        <label for={sphereModuleCaptureStrengthId}>Sphere Module Capture Strength</label>
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
            </tbody>
        </table>
    );
}
