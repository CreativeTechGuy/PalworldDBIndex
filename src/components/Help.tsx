import { createSignal, For, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { rootElement } from "~/config/rootElement";
import helpIcon from "~/icons/help.svg";
import { Dialog } from "./Dialog";

const helpText = {
    General:
        "Click column headers to sort by that column. Click on a row to highlight it, multiple rows can be highlighted at once. Any underlined text in the table has more detailed info available when clicked.",
    About: "This site is intended to be a quick reference guide for all Pal information. It is not a comprehensive guide for the game but assumes you have some knowledge about the game already. All of the data is pulled directly from the game's files and transformed to make it easy to consume the info. In the game's files, a lot of data is unused, redundant and sometimes misleading/incorrect but this site will leave it as-is for the most part.",
    Settings:
        "The settings gear in the bottom corner lets you configure global settings for the site. For calculating capture chances, you can also configure your game state and preferences which are used to calculate the Minimum Sphere column. There you can hide/show and drag to reorder columns to focus on the data that you care about. Columns are hidden by default if the data is unused or not commonly useful.",
    Filters:
        "The filter funnel in the bottom corner lets you control how rows are displayed in the main table. Any highlighted rows can be automatically grouped together at the top of the table with an option here. Additionally you can only display rows which contain whatever filter text you enter on that popup. The filter rows option will try to match text across all of the currently visible columns.",
    "Minimum Spheres":
        "In the settings, configure your Pal capture preferences to make this feature most useful. In the Minimum Spheres column, you'll see a popup showing the minimum sphere you need to get at least the capture rate you configured, based on the Pal level.",
    Element:
        "Pals have weaknesses and advantages against other elements. Your Pal's weaknesses are based on the Elements of your Pal. The strengths are based on the Elements of the attacks your Pal uses. The popup on this column will show the strengths and weaknesses of the Pal's two Elements combined.",
    Friendship:
        "Also known as Trust. This is a level that increases, up to 10, on your Pal the more they are in your party which will increase their base stats. Several columns in the table show the stat changes based on Friendship and stats with Max Friendship.",
    Breeding:
        "In the Breeding column you'll see a list of every Pal combination which will lay an egg for the selected Pal. This list will often be large. Highlighting Pals in the main table will sort them to the top of the breeding pairs list. This can help you find parents which include Pals you have or want to pass down certain traits.",
    Rideable:
        "Pals which are ridable can be Land, Flying, Water, or some hybrid. Non-flying pals can go in the water (which uses their Swim Speed stats) but will consume Stamina when doing so. Water pals are special in that they don't consume Stamina in water.",
    "Spawn Locations":
        "The Spawn Areas highlight parts of the world map where the selected Pal will spawn. This may be somewhere in the overworld at day/night or in a dungeon. If they are a dungeon exclusive, the dungeon entrance will be shown instead. You can hover the map to pulse the dots on the map to help spotting them.",
};

export function Help(): JSXElement {
    const [open, setOpen] = createSignal(false);
    return (
        <>
            <button
                class="link-button floating-button"
                title="Help"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <img style={{ height: "100%" }} src={helpIcon} alt="Settings icon" />
            </button>
            {open() && (
                <Portal mount={rootElement}>
                    <Dialog
                        title="Help"
                        onClose={() => {
                            setOpen(false);
                        }}
                    >
                        <div style={{ width: "clamp(400px, 50vw, 800px)" }}>
                            <For each={Object.entries(helpText)}>
                                {([title, text], index) => (
                                    <details open={index() === 0}>
                                        <summary>{title}</summary>
                                        {text}
                                    </details>
                                )}
                            </For>
                        </div>
                    </Dialog>
                </Portal>
            )}
        </>
    );
}
