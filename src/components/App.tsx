import type { JSXElement } from "solid-js";
import { Filter } from "./Filter";
import { Help } from "./Help";
import { PalTable } from "./PalTable";
import { Settings } from "./Settings";

export function App(): JSXElement {
    return (
        <>
            <PalTable />
            <div class="floating-button-area">
                <Filter />
                <Settings />
                <Help />
            </div>
        </>
    );
}
