import { createMemo, createSignal, For, onMount, type JSXElement } from "solid-js";
import { Dialog } from "~/components/Dialog";
import { palSpawners } from "~/data/palSpawners";
import raidBossData from "~/raw_data/Pal/Content/Pal/Blueprint/RaidBoss/DT_PalRaidBoss.json";
import worldMapScaleData from "~/raw_data/Pal/Content/Pal/DataTable/WorldMapUIData/DT_WorldMapUIData.json";
import mapImg from "~/raw_data/Pal/Content/Pal/Texture/UI/Map/T_WorldMap.png";
import { convertDataTableType } from "~/utils/convertDataTableType";
import type { CustomFieldProps } from "./customFields";

const worldMapScale = worldMapScaleData[0].Rows;
const raidBossMap = convertDataTableType(raidBossData);
const radius = 15000;

export function SpawnLocations(props: CustomFieldProps<string>): JSXElement {
    const [open, setOpen] = createSignal(false);
    const [displayMode, setDisplayMode] = createSignal<"day" | "night" | "dungeon">("day");
    const [touchHover, setTouchHover] = createSignal(false);
    const daySpawnLocations = createMemo(() =>
        removeDuplicatePoints(
            palSpawners[props.palData.Id]?.spawnPoints.filter((spawn) => !spawn.NightOnly && !spawn.Dungeon) ?? [],
            radius
        )
    );
    const nightSpawnLocations = createMemo(() =>
        removeDuplicatePoints(
            palSpawners[props.palData.Id]?.spawnPoints.filter((spawn) => spawn.NightOnly && !spawn.Dungeon) ?? [],
            radius
        )
    );
    const hasDaySpawns = createMemo(() => daySpawnLocations().length > 0);
    const hasNightSpawns = createMemo(() => nightSpawnLocations().length > 0);
    const hasNoOverworldSpawns = createMemo(() => !hasDaySpawns() && !hasNightSpawns());
    const canSwitchTime = createMemo(() => hasDaySpawns() && hasNightSpawns());
    const isRaidBoss = createMemo(() => `PalSummon_${props.palData.Id}` in raidBossMap);
    const dungeonSpawnLocations = createMemo(() =>
        removeDuplicatePoints(palSpawners[props.palData.Id]?.spawnPoints.filter((spawn) => spawn.Dungeon) ?? [], radius)
    );
    const canSwitchDungeon = createMemo(
        () => (hasDaySpawns() || hasNightSpawns()) && dungeonSpawnLocations().length > 0
    );
    const title = createMemo(() => {
        if (displayMode() === "dungeon") {
            return `Dungeons for ${props.palData.Name} (${dungeonSpawnLocations().length})`;
        }
        if (daySpawnLocations().length > 0 && nightSpawnLocations().length === 0) {
            return `Spawn Areas for ${props.palData.Name} (${daySpawnLocations().length})`;
        }
        return `${displayMode() === "day" ? "Daytime" : "Nighttime"} Spawn Areas for ${props.palData.Name} (${(displayMode() === "day" ? daySpawnLocations() : nightSpawnLocations()).length})`;
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
        if (dungeonSpawnLocations().length > 0 && hasNoOverworldSpawns()) {
            setDisplayMode("dungeon");
        }
        if (!hasDaySpawns() && hasNightSpawns()) {
            setDisplayMode("night");
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
                                {(canSwitchDungeon() || canSwitchTime()) && (
                                    <label>
                                        Switch Spawn Map
                                        <select
                                            value={displayMode()}
                                            onChange={(evt) => {
                                                setDisplayMode(evt.target.value as ReturnType<typeof displayMode>);
                                            }}
                                        >
                                            {canSwitchTime() ? (
                                                <>
                                                    <option value="day">Day</option>
                                                    <option value="night">Night</option>
                                                </>
                                            ) : (
                                                <option value="day">Anytime</option>
                                            )}
                                            {canSwitchDungeon() && <option value="dungeon">Dungeon</option>}
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
                                <div style={{ position: "relative", margin: "auto", width: "fit-content" }}>
                                    <img
                                        src={mapImg}
                                        class="map-image"
                                        style={{
                                            filter: displayMode() === "night" ? "brightness(0.5)" : "none",
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
                                        <For
                                            each={
                                                displayMode() === "dungeon"
                                                    ? dungeonSpawnLocations()
                                                    : displayMode() === "day"
                                                      ? daySpawnLocations()
                                                      : nightSpawnLocations()
                                            }
                                        >
                                            {(point) => (
                                                <circle
                                                    style={{ "--initial-radius": point.Radius }}
                                                    class="map-dot"
                                                    r={point.Radius}
                                                    fill="yellow"
                                                    fill-opacity="1"
                                                    cx={point.X}
                                                    cy={point.Y}
                                                >
                                                    <title>
                                                        {point.MinLevel === point.MaxLevel
                                                            ? `Level: ${point.MinLevel}`
                                                            : `Levels: ${point.MinLevel} - ${point.MaxLevel}`}
                                                    </title>
                                                </circle>
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

function removeDuplicatePoints<Item extends { X: number; Y: number }>(arr: Item[], r: number): Item[] {
    const seenPoints = new Set<string>();
    const roundFactor = Math.round(r * 0.5);
    return arr.filter((item) => {
        const point = `${Math.round(item.X / roundFactor)},${Math.round(item.Y / roundFactor)}`;
        if (seenPoints.has(point)) {
            return false;
        }
        seenPoints.add(point);
        return true;
    });
}
