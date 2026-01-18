import { createMemo, createSignal, For, onMount, type JSXElement } from "solid-js";
import { Dialog } from "~/components/Dialog";
import spawnLocations from "~/raw_data/DT_PaldexDistributionData.json";
import worldMapScaleData from "~/raw_data/DT_WorldMapUIData.json";
import mapImg from "~/raw_data/T_WorldMap.png";
import { convertDataTableType } from "~/utils/convertDataTableType";
import type { CustomFieldProps } from "./customFields";

type SpawnFile = [
    {
        Rows: Partial<
            Record<
                string,
                {
                    dayTimeLocations: {
                        locations: { X: number; Y: number; Z: number }[];
                        Radius: number;
                    };
                    nightTimeLocations: {
                        locations: { X: number; Y: number; Z: number }[];
                        Radius: number;
                    };
                }
            >
        >;
    },
];

const worldMapScale = worldMapScaleData[0].Rows;
const spawnLocationMap = convertDataTableType(spawnLocations as unknown as SpawnFile);

export function SpawnLocations(props: CustomFieldProps<string>): JSXElement {
    const [open, setOpen] = createSignal(false);
    const [isDay, setIsDay] = createSignal(true);
    const radius = createMemo(
        () =>
            spawnLocationMap[props.palData.Id]?.[isDay() ? "dayTimeLocations" : "nightTimeLocations"].Radius ??
            spawnLocationMap[`BOSS_${props.palData.Id}`]?.[isDay() ? "dayTimeLocations" : "nightTimeLocations"].Radius
    );
    const daySpawnLocations = createMemo(() => [
        ...(spawnLocationMap[props.palData.Id]?.dayTimeLocations.locations ?? []),
        ...(spawnLocationMap[`BOSS_${props.palData.Id}`]?.dayTimeLocations.locations ?? []),
    ]);
    const nightSpawnLocations = createMemo(() => [
        ...(spawnLocationMap[props.palData.Id]?.nightTimeLocations.locations ?? []),
        ...(spawnLocationMap[`BOSS_${props.palData.Id}`]?.nightTimeLocations.locations ?? []),
    ]);
    const hasDaySpawns = createMemo(() => daySpawnLocations().length > 0);
    const hasNightSpawns = createMemo(() => nightSpawnLocations().length > 0);
    const hasNoSpawns = createMemo(() => !hasDaySpawns() && !hasNightSpawns());
    const spawnsTimeIdentical = createMemo(() => areArraysIdentical(daySpawnLocations(), nightSpawnLocations()));
    const canSwitchTime = createMemo(() => hasDaySpawns() && hasNightSpawns() && !spawnsTimeIdentical());
    onMount(() => {
        if (!hasDaySpawns() && hasNightSpawns()) {
            setIsDay(false);
        }
    });
    return (
        <>
            <button onClick={() => setOpen(true)} class="link-button">
                {props.value}
            </button>
            {open() && (
                <Dialog
                    title={`${!spawnsTimeIdentical() ? (isDay() ? "Daytime " : "Nighttime ") : ""}Spawn Areas for ${props.palData.Name} (${(isDay() ? daySpawnLocations() : nightSpawnLocations()).length})`}
                    onClose={() => {
                        setOpen(false);
                    }}
                >
                    <div class="center">
                        {hasNoSpawns() ? (
                            "No overworld spawns for this pal."
                        ) : (
                            <>
                                {canSwitchTime() && (
                                    <div>
                                        <button
                                            class="link-button"
                                            onClick={() => {
                                                setIsDay((current) => !current);
                                            }}
                                        >
                                            Switch to {isDay() ? "Night" : "Day"} Spawns
                                        </button>
                                    </div>
                                )}
                                <div style={{ position: "relative", margin: "auto", width: "fit-content" }}>
                                    <img
                                        src={mapImg}
                                        style={{
                                            "max-width": "75vw",
                                            "max-height": "75vh",
                                            "aspect-ratio": "1 / 1",
                                            filter: isDay() ? "none" : "brightness(0.5)",
                                        }}
                                        alt="World map"
                                    />
                                    <svg
                                        class="map-markers"
                                        viewBox={`${worldMapScale.MainMap.landScapeRealPositionMin.X} ${worldMapScale.MainMap.landScapeRealPositionMin.Y} ${worldMapScale.MainMap.landScapeRealPositionMax.X - worldMapScale.MainMap.landScapeRealPositionMin.X} ${worldMapScale.MainMap.landScapeRealPositionMax.Y - worldMapScale.MainMap.landScapeRealPositionMin.Y}`}
                                    >
                                        <For each={isDay() ? daySpawnLocations() : nightSpawnLocations()}>
                                            {(point) => (
                                                <circle
                                                    style={{ "--initial-radius": radius() }}
                                                    class="map-dot"
                                                    r={radius()}
                                                    fill="yellow"
                                                    fill-opacity="1"
                                                    cx={point.X}
                                                    cy={point.Y}
                                                />
                                            )}
                                        </For>
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                </Dialog>
            )}
        </>
    );
}

function areArraysIdentical(
    arr1: { X: number; Y: number; Z: number }[],
    arr2: { X: number; Y: number; Z: number }[]
): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].X !== arr2[i].X || arr1[i].Y !== arr2[i].Y) {
            return false;
        }
    }
    return true;
}
