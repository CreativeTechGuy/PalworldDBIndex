import { createMemo, createSignal, For, onMount, type JSXElement } from "solid-js";
import { Dialog } from "~/components/Dialog";
import { palLevelRanges } from "~/data/palLevelRanges";
import { spawnLocationMap as spawnLocationMapUntyped, spawnerLocationMap } from "~/data/spawnLocations";
import raidBossData from "~/raw_data/Pal/Content/Pal/Blueprint/RaidBoss/DT_PalRaidBoss.json";
import wildSpawnersData from "~/raw_data/Pal/Content/Pal/DataTable/Spawner/DT_PalWildSpawner.json";
// cspell:disable-next-line
import bossSpawnerData from "~/raw_data/Pal/Content/Pal/DataTable/UI/DT_BossSpawnerLoactionData.json";
import worldMapScaleData from "~/raw_data/Pal/Content/Pal/DataTable/WorldMapUIData/DT_WorldMapUIData.json";
import mapImg from "~/raw_data/Pal/Content/Pal/Texture/UI/Map/T_WorldMap.png";
import type { SpawnData, SpawnerData } from "~/types/SpawnLocations";
import { convertDataTableType } from "~/utils/convertDataTableType";
import type { CustomFieldProps } from "./customFields";

const spawnLocationMap = spawnLocationMapUntyped as SpawnData;
const worldMapScale = worldMapScaleData[0].Rows;
const raidBossMap = convertDataTableType(raidBossData);
const spawnerLocations = Object.values(spawnerLocationMap as SpawnerData);
const bossSpawnerMap = Object.values(convertDataTableType(bossSpawnerData)).reduce<
    Partial<Record<string, { X: number; Y: number }>>
>((acc, cur) => {
    acc[cur.CharacterID.replace(/BOSS_/i, "")] = cur.Location;
    return acc;
}, {});
const dungeonSpawns = Object.entries(convertDataTableType(wildSpawnersData)).reduce<
    Record<string, { X: number; Y: number; Radius: number }[]>
>((acc, [key, value]) => {
    if (!key.startsWith("dungeon_")) {
        return acc;
    }
    const pals = [value.Pal_1, value.Pal_2, value.Pal_3].filter((id) => id !== "None");
    const spawnerLocationData = spawnerLocations.find((spawner) => spawner.SpawnerName === value.SpawnerName);
    if (spawnerLocationData === undefined) {
        return acc;
    }
    for (const pal of pals) {
        acc[pal] ??= [];
        acc[pal].push({
            X: spawnerLocationData.Location.X,
            Y: spawnerLocationData.Location.Y,
            Radius: spawnerLocationData.StaticRadius,
        });
    }
    return acc;
}, {});

export function SpawnLocations(props: CustomFieldProps<string>): JSXElement {
    const [open, setOpen] = createSignal(false);
    const [isDay, setIsDay] = createSignal(true);
    const [touchHover, setTouchHover] = createSignal(false);
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
    const radius = createMemo(
        () =>
            spawnLocationMap[props.palData.Id]?.[isDay() ? "dayTimeLocations" : "nightTimeLocations"].Radius ||
            spawnLocationMap[`BOSS_${props.palData.Id}`]?.[isDay() ? "dayTimeLocations" : "nightTimeLocations"]
                .Radius ||
            15000
    );
    /* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
    const daySpawnLocations = createMemo(() =>
        removeDuplicatePoints(
            [
                ...(spawnLocationMap[props.palData.Id]?.dayTimeLocations.locations ?? []),
                ...(spawnLocationMap[`BOSS_${props.palData.Id}`]?.dayTimeLocations.locations ?? []),
                ...(props.palData.Id in bossSpawnerMap ? [bossSpawnerMap[props.palData.Id]!] : []),
            ],
            radius()
        )
    );
    const nightSpawnLocations = createMemo(() =>
        removeDuplicatePoints(
            [
                ...(spawnLocationMap[props.palData.Id]?.nightTimeLocations.locations ?? []),
                ...(spawnLocationMap[`BOSS_${props.palData.Id}`]?.nightTimeLocations.locations ?? []),
                ...(props.palData.Id in bossSpawnerMap ? [bossSpawnerMap[props.palData.Id]!] : []),
            ],
            radius()
        )
    );
    const hasDaySpawns = createMemo(() => daySpawnLocations().length > 0);
    const hasNightSpawns = createMemo(() => nightSpawnLocations().length > 0);
    const hasNoOverworldSpawns = createMemo(() => !hasDaySpawns() && !hasNightSpawns());
    const spawnsTimeIdentical = createMemo(() => areArraysIdentical(daySpawnLocations(), nightSpawnLocations()));
    const canSwitchTime = createMemo(() => hasDaySpawns() && hasNightSpawns() && !spawnsTimeIdentical());
    const isRaidBoss = createMemo(() => `PalSummon_${props.palData.Id}` in raidBossMap);
    const dungeonSpawnLocations = createMemo(() =>
        removeDuplicatePoints(dungeonSpawns[props.palData.Id] ?? [], radius())
    );
    const title = createMemo(() => {
        if (dungeonSpawnLocations().length > 0 && hasNoOverworldSpawns()) {
            return `Dungeons for ${props.palData.Name} (${dungeonSpawnLocations().length})`;
        }
        if (spawnsTimeIdentical()) {
            return `Spawn Areas for ${props.palData.Name} (${daySpawnLocations().length})`;
        }
        return `${isDay() ? "Daytime" : "Nighttime"} Spawn Areas for ${props.palData.Name} (${(isDay() ? daySpawnLocations() : nightSpawnLocations()).length})`;
    });
    const displayText = createMemo(() => {
        if (hasNoOverworldSpawns()) {
            if (dungeonSpawnLocations().length === 0) {
                if (isRaidBoss()) {
                    return "Raid only";
                }
                return "N/A";
            }
            return "Dungeon";
        }
        return "Overworld";
    });

    onMount(() => {
        if (!hasDaySpawns() && hasNightSpawns()) {
            setIsDay(false);
        }
        if (props.palData.SpawnLocations !== displayText()) {
            props.updateData({
                ...props.palData,
                SpawnLocations: displayText(),
            });
        }
    });
    return (
        <>
            {!hasNoOverworldSpawns() || dungeonSpawnLocations().length > 0 ? (
                <>
                    <button onClick={() => setOpen(true)} class="link-button">
                        {props.value}
                    </button>
                    {open() && (
                        <Dialog
                            title={title()}
                            onClose={() => {
                                setOpen(false);
                            }}
                        >
                            <div class="center">
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
                                <div>
                                    Level Range: {palLevelRanges[props.palData.Id].min} -{" "}
                                    {palLevelRanges[props.palData.Id].max}
                                </div>
                                <div style={{ position: "relative", margin: "auto", width: "fit-content" }}>
                                    <img
                                        src={mapImg}
                                        class="map-image"
                                        style={{
                                            filter: isDay() ? "none" : "brightness(0.5)",
                                        }}
                                        alt="World map"
                                    />
                                    <svg
                                        classList={{ "map-markers": true, "map-hover": touchHover() }}
                                        onTouchStart={() => {
                                            setTouchHover(true);
                                            document.body.classList.add("select-none");
                                        }}
                                        onTouchEnd={() => {
                                            setTouchHover(false);
                                            document.body.classList.remove("select-none");
                                        }}
                                        viewBox={`${worldMapScale.MainMap.landScapeRealPositionMin.X} ${worldMapScale.MainMap.landScapeRealPositionMin.Y} ${worldMapScale.MainMap.landScapeRealPositionMax.X - worldMapScale.MainMap.landScapeRealPositionMin.X} ${worldMapScale.MainMap.landScapeRealPositionMax.Y - worldMapScale.MainMap.landScapeRealPositionMin.Y}`}
                                    >
                                        <For<{ X: number; Y: number; Radius?: number }[], JSXElement>
                                            each={
                                                hasNoOverworldSpawns()
                                                    ? dungeonSpawnLocations()
                                                    : isDay()
                                                      ? daySpawnLocations()
                                                      : nightSpawnLocations()
                                            }
                                        >
                                            {(point) => (
                                                <circle
                                                    style={{ "--initial-radius": point.Radius ?? radius() }}
                                                    class="map-dot"
                                                    r={point.Radius ?? radius()}
                                                    fill="yellow"
                                                    fill-opacity="1"
                                                    cx={point.X}
                                                    cy={point.Y}
                                                />
                                            )}
                                        </For>
                                    </svg>
                                </div>
                            </div>
                        </Dialog>
                    )}
                </>
            ) : (
                displayText()
            )}
        </>
    );
}

function areArraysIdentical(arr1: { X: number; Y: number }[], arr2: { X: number; Y: number }[]): boolean {
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

function removeDuplicatePoints(arr: { X: number; Y: number }[], radius: number): { X: number; Y: number }[] {
    const seenPoints = new Set<string>();
    const roundFactor = Math.round(radius * 0.5);
    return arr.filter((item) => {
        const point = `${Math.round(item.X / roundFactor)},${Math.round(item.Y / roundFactor)}`;
        if (seenPoints.has(point)) {
            return false;
        }
        seenPoints.add(point);
        return true;
    });
}
