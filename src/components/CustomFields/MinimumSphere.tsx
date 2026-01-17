import { createMemo, For, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import itemNames from "~/raw_data/DT_ItemNameText_Common.json";
import { getMaxPalLevelForSpheres, type MinimumSpheres } from "~/utils/getCaptureRate";
import { getPalBossData } from "~/utils/getPalBossData";
import type { CustomFieldProps } from "./customFields";

const textRows = itemNames[0].Rows;

export function MinimumSphere(props: CustomFieldProps<string>): JSXElement {
    const minimumSpheres = createMemo(() =>
        getMaxPalLevelForSpheres({
            healthRemaining: 0.1,
            lifmunkLevel: 5,
            worldSettingCaptureRate: 1,
            palIntrinsicCaptureRate: props.palData.CaptureRateCorrect,
            minCaptureRateAcceptable: 0.05,
            isBack: false,
        })
    );
    const palBossData = createMemo(() => getPalBossData(props.palData.Id));
    const hasUniqueBossStats = createMemo(() => palBossData().CaptureRateCorrect !== props.palData.CaptureRateCorrect);
    const minimumSpheresBoss = createMemo(() => {
        if (!hasUniqueBossStats()) {
            return minimumSpheres();
        }
        return getMaxPalLevelForSpheres({
            healthRemaining: 0.1,
            lifmunkLevel: 5,
            worldSettingCaptureRate: 1,
            palIntrinsicCaptureRate: palBossData().CaptureRateCorrect,
            minCaptureRateAcceptable: 0.05,
            isBack: false,
        });
    });
    return (
        <Hover label={props.value}>
            {hasUniqueBossStats() && <div class="center">Normal Pal</div>}
            <SphereList spheres={minimumSpheres()} />
            {hasUniqueBossStats() && (
                <>
                    <br />
                    {hasUniqueBossStats() && <div class="center">Boss Pal</div>}
                    <SphereList spheres={minimumSpheresBoss()} />
                </>
            )}
        </Hover>
    );
}

type SphereListProps = {
    spheres: MinimumSpheres;
};

function SphereList(props: SphereListProps): JSXElement {
    return (
        <table>
            <For each={Object.entries(props.spheres)}>
                {([sphere, minLevel]) => {
                    const sphereId = sphere === "Normal" ? "ITEM_NAME_PalSphere" : `ITEM_NAME_PalSphere_${sphere}`;
                    return (
                        <tr>
                            <td>{textRows[sphereId as keyof typeof textRows].TextData.LocalizedString}</td>
                            <td>{minLevel}</td>
                        </tr>
                    );
                }}
            </For>
        </table>
    );
}
