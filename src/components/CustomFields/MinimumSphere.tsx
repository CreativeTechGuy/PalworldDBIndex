import { createMemo, For, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import { sphereSettings } from "~/config/sphereSettings";
import { maxWildPalLevel } from "~/data/palSpawners";
import itemNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText_Common.json";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getMaxPalLevelForSpheres, type MinimumSpheres } from "~/utils/getCaptureRate";
import { getPalBossData } from "~/utils/getPalBossData";
import type { CustomFieldProps } from "./customFields";

const textRows = convertDataTableType(itemNames);

export function MinimumSphere(props: CustomFieldProps<string>): JSXElement {
    const maxLevels = createMemo(() =>
        getMaxPalLevelForSpheres({
            ...sphereSettings(),
            palIntrinsicCaptureRate: props.palData.CaptureRateCorrect,
        })
    );
    const palBossData = createMemo(() => getPalBossData(props.palData.Id));
    const hasUniqueBossStats = createMemo(() => palBossData().CaptureRateCorrect !== props.palData.CaptureRateCorrect);
    const maxLevelsBoss = createMemo(() => {
        if (!hasUniqueBossStats()) {
            return maxLevels();
        }
        return getMaxPalLevelForSpheres({
            ...sphereSettings(),
            palIntrinsicCaptureRate: palBossData().CaptureRateCorrect,
        });
    });
    return (
        <>
            {props.palData.SpawnLocations !== "Raid only" ? (
                <Hover label={props.value} title="Minimum Spheres">
                    <table>
                        <tbody>
                            <tr>
                                <td>{sphereSettings().healthRemaining * 100}%</td>
                                <td>Health</td>
                            </tr>
                            <tr>
                                <td>{sphereSettings().minCaptureRateAcceptable * 100}%</td>
                                <td>Minimum Capture Rate</td>
                            </tr>
                            <tr>
                                <td>{sphereSettings().isBack ? "Yes" : "No"}</td>
                                <td>Back Bonus</td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    {hasUniqueBossStats() && <div class="center bold">Normal Pal</div>}
                    <SphereList spheres={maxLevels()} />
                    {hasUniqueBossStats() && (
                        <>
                            <br />
                            {hasUniqueBossStats() && <div class="center bold">Alpha Pal</div>}
                            <SphereList spheres={maxLevelsBoss()} />
                        </>
                    )}
                </Hover>
            ) : (
                "N/A"
            )}
        </>
    );
}

type SphereListProps = {
    spheres: MinimumSpheres;
};

function SphereList(props: SphereListProps): JSXElement {
    const entries = createMemo(() => Object.entries(props.spheres));
    return (
        <table>
            <tbody>
                <tr>
                    <th>Pal Level</th>
                    <th>Min Sphere</th>
                </tr>
                <For each={entries()}>
                    {([sphere, maxLevel], index) => {
                        const sphereId = sphere === "Normal" ? "ITEM_NAME_PalSphere" : `ITEM_NAME_PalSphere_${sphere}`;
                        const previousLevel = createMemo(() => (index() === 0 ? 0 : entries()[index() - 1][1]));
                        return (
                            <tr>
                                <td>
                                    {maxLevel === 0 ? (
                                        <>N/A</>
                                    ) : (
                                        <>
                                            {Math.min(maxWildPalLevel, previousLevel() + 1)
                                                .toString()
                                                .padStart(2, "0")}{" "}
                                            - {maxLevel.toString().padStart(2, "0")}
                                        </>
                                    )}
                                </td>
                                <td>{textRows[sphereId].TextData.LocalizedString}</td>
                            </tr>
                        );
                    }}
                </For>
            </tbody>
        </table>
    );
}
