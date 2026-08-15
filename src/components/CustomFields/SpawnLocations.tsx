import { createMemo, createSignal, For, onMount, type JSXElement } from "solid-js";
import { Dialog } from "~/components/Dialog";
import { palSpawners } from "~/data/palSpawners";
import { randomEventPal } from "~/data/randomEventPal";
import raidBossData from "~/raw_data/Pal/Content/Pal/Blueprint/RaidBoss/DT_PalRaidBoss.json";
import worldMapScaleData from "~/raw_data/Pal/Content/Pal/DataTable/WorldMapUIData/DT_WorldMapUIData.json";
import treeMapImg from "~/raw_data/Pal/Content/Pal/Texture/UI/Map/T_TreeMap.png";
import mainMapImg from "~/raw_data/Pal/Content/Pal/Texture/UI/Map/T_WorldMap.png";
import { convertDataTableType } from "~/utils/convertDataTableType";
import type { CustomFieldProps } from "./customFields";

const worldMapScale = worldMapScaleData[0].Rows;
const raidBossMap = convertDataTableType(raidBossData);

export function SpawnLocations(props: CustomFieldProps<string>): JSXElement {
    const [open, setOpen] = createSignal(false);
    const [displayMode, setDisplayMode] = createSignal<"day" | "night" | "dungeon" | "fishing" | "nightFishing">("day");
    const [touchHover, setTouchHover] = createSignal(false);
    const daySpawnLocations = createMemo(
        () =>
            palSpawners[props.palData.Id]?.spawnPoints.filter(
                (spawn) => !spawn.NightOnly && !spawn.Dungeon && !spawn.Fishing
            ) ?? []
    );
    const nightSpawnLocations = createMemo(
        () =>
            palSpawners[props.palData.Id]?.spawnPoints.filter(
                (spawn) => spawn.NightOnly && !spawn.Dungeon && !spawn.Fishing
            ) ?? []
    );
    const hasDaySpawns = createMemo(() => daySpawnLocations().length > 0);
    const hasNightSpawns = createMemo(() => nightSpawnLocations().length > 0);
    const hasNoOverworldSpawns = createMemo(() => !hasDaySpawns() && !hasNightSpawns());
    const canSwitchTime = createMemo(() => hasDaySpawns() && hasNightSpawns());
    const isRaidBoss = createMemo(() => `PalSummon_${props.palData.Id}` in raidBossMap);
    const isRandomEventPal = createMemo(() => randomEventPal.includes(props.palData.Id));
    const dungeonSpawnLocations = createMemo(
        () => palSpawners[props.palData.Id]?.spawnPoints.filter((spawn) => spawn.Dungeon && !spawn.Fishing) ?? []
    );
    const canSwitchDungeon = createMemo(() => dungeonSpawnLocations().length > 0);
    const fishingSpawnLocations = createMemo(
        () => palSpawners[props.palData.Id]?.spawnPoints.filter((spawn) => spawn.Fishing && !spawn.NightOnly) ?? []
    );
    const canSwitchFishing = createMemo(() => fishingSpawnLocations().length > 0);
    const nightFishingSpawnLocations = createMemo(
        () => palSpawners[props.palData.Id]?.spawnPoints.filter((spawn) => spawn.Fishing && spawn.NightOnly) ?? []
    );
    const canSwitchNightFishing = createMemo(() => nightFishingSpawnLocations().length > 0);
    const title = createMemo(() => {
        if (displayMode() === "dungeon") {
            return `Dungeons for ${props.palData.Name} (${dungeonSpawnLocations().length})`;
        }
        if (displayMode() === "fishing") {
            return `Fishing Areas for ${props.palData.Name} (${fishingSpawnLocations().length})`;
        }
        if (displayMode() === "nightFishing") {
            return `Night Fishing Areas for ${props.palData.Name} (${nightFishingSpawnLocations().length})`;
        }
        if (daySpawnLocations().length > 0 && nightSpawnLocations().length === 0) {
            return `Spawn Areas for ${props.palData.Name} (${daySpawnLocations().length})`;
        }
        return `${displayMode() === "day" ? "Daytime" : "Nighttime"} Spawn Areas for ${props.palData.Name} (${(displayMode() === "day" ? daySpawnLocations() : nightSpawnLocations()).length})`;
    });
    const maps = createMemo(() => {
        const maps: ("main" | "tree")[] = [];
        if (palSpawners[props.palData.Id]?.spawnPoints.some((spawn) => spawn.Map === "main") === true) {
            maps.push("main");
        }
        if (palSpawners[props.palData.Id]?.spawnPoints.some((spawn) => spawn.Map === "tree") === true) {
            maps.push("tree");
        }
        return maps;
    });
    const displayText = createMemo(() => {
        if (hasNoOverworldSpawns()) {
            if (fishingSpawnLocations().length > 0) {
                return "Fishing";
            }
            if (dungeonSpawnLocations().length === 0) {
                if (isRaidBoss()) {
                    return "Raid only";
                }
                if (isRandomEventPal()) {
                    return "Event only";
                }
                return "Breeding only";
            }
            return "Dungeon";
        }
        if (maps().includes("main")) {
            return "Overworld";
        }
        return "World Tree";
    });

    onMount(() => {
        if (dungeonSpawnLocations().length > 0 && hasNoOverworldSpawns()) {
            setDisplayMode("dungeon");
        } else if (fishingSpawnLocations().length > 0 && hasNoOverworldSpawns()) {
            setDisplayMode("fishing");
        } else if (nightFishingSpawnLocations().length > 0 && hasNoOverworldSpawns()) {
            setDisplayMode("nightFishing");
        } else if (!hasDaySpawns() && hasNightSpawns()) {
            setDisplayMode("night");
        }
        if (props.palData.SpawnLocations !== displayText()) {
            props.updateData({
                ...props.palData,
                SpawnLocations: displayText(),
            });
        }
    });

    const modeOptions = createMemo(() => {
        const options: { value: string; label: string }[] = [];
        if (canSwitchTime()) {
            options.push({ value: "day", label: "Day" });
            options.push({ value: "night", label: "Night" });
        } else if (daySpawnLocations().length > 0) {
            options.push({ value: "day", label: "Anytime" });
        }
        if (canSwitchDungeon()) {
            options.push({ value: "dungeon", label: "Dungeon" });
        }
        if (canSwitchFishing()) {
            options.push({ value: "fishing", label: "Fishing" });
        }
        if (canSwitchNightFishing()) {
            options.push({ value: "nightFishing", label: "Night Fishing" });
        }
        return options;
    });

    function MapRenderer(mapRendererProps: {
        mapName: "main" | "tree";
        img: string;
        mapBounds: typeof worldMapScale.MainMap | typeof worldMapScale.Tree;
    }): JSXElement {
        const points = createMemo(() =>
            displayMode() === "dungeon"
                ? dungeonSpawnLocations()
                : displayMode() === "fishing"
                  ? fishingSpawnLocations()
                  : displayMode() === "nightFishing"
                    ? nightFishingSpawnLocations()
                    : displayMode() === "day"
                      ? daySpawnLocations()
                      : nightSpawnLocations()
        );
        const pointsInView = createMemo(() => points().filter((point) => point.Map === mapRendererProps.mapName));

        return (
            <div
                style={{
                    position: "relative",
                    margin: "auto",
                    width: "fit-content",
                    display: pointsInView().length === 0 ? "none" : undefined,
                }}
            >
                <img
                    src={mapRendererProps.img}
                    class="map-image"
                    style={{
                        filter:
                            displayMode() === "night" || displayMode() === "nightFishing" ? "brightness(0.5)" : "none",
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
                    viewBox={`${mapRendererProps.mapBounds.landScapeRealPositionMin.X} ${mapRendererProps.mapBounds.landScapeRealPositionMin.Y} ${mapRendererProps.mapBounds.landScapeRealPositionMax.X - mapRendererProps.mapBounds.landScapeRealPositionMin.X} ${mapRendererProps.mapBounds.landScapeRealPositionMax.Y - mapRendererProps.mapBounds.landScapeRealPositionMin.Y}`}
                >
                    <For each={pointsInView()}>
                        {(point) => {
                            const radius = point.Map === "main" ? point.Radius : Math.round(point.Radius / 3);
                            return (
                                <circle
                                    style={{ "--initial-radius": radius }}
                                    class="map-dot"
                                    r={radius}
                                    fill="yellow"
                                    fill-opacity="1"
                                    cx={point.X}
                                    cy={point.Y}
                                >
                                    <title>
                                        {point.MaxLevel > 0
                                            ? point.MinLevel === point.MaxLevel
                                                ? `Level: ${point.MinLevel}`
                                                : `Levels: ${point.MinLevel} - ${point.MaxLevel}`
                                            : ""}
                                    </title>
                                </circle>
                            );
                        }}
                    </For>
                </svg>
            </div>
        );
    }

    return (
        <>
            {!hasNoOverworldSpawns() || dungeonSpawnLocations().length > 0 || fishingSpawnLocations().length > 0 ? (
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
                                {modeOptions().length > 1 && (
                                    <label>
                                        Switch Spawn Map{" "}
                                        <select
                                            value={displayMode()}
                                            onChange={(evt) => {
                                                setDisplayMode(evt.target.value as ReturnType<typeof displayMode>);
                                            }}
                                        >
                                            <For each={modeOptions()}>
                                                {(option) => <option value={option.value}>{option.label}</option>}
                                            </For>
                                        </select>
                                    </label>
                                )}
                                {palSpawners[props.palData.Id]?.min === palSpawners[props.palData.Id]?.max ? (
                                    <div>Level: {palSpawners[props.palData.Id]?.min}</div>
                                ) : (
                                    <div>
                                        Level Range: {palSpawners[props.palData.Id]?.min} -{" "}
                                        {palSpawners[props.palData.Id]?.max}
                                    </div>
                                )}
                            </div>
                            <div style={{ "overflow-y": "auto" }}>
                                {maps().includes("main") && (
                                    <MapRenderer img={mainMapImg} mapBounds={worldMapScale.MainMap} mapName="main" />
                                )}
                                {maps().includes("tree") && (
                                    <MapRenderer img={treeMapImg} mapBounds={worldMapScale.Tree} mapName="tree" />
                                )}
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
