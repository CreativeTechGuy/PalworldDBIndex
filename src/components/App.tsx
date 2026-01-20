import type { JSXElement } from "solid-js";
import { Filter } from "./Filter";
import { PalTable } from "./PalTable";
import { Settings } from "./Settings";

export function App(): JSXElement {
    return (
        <>
            <PalTable />
            <Filter />
            <Settings />
        </>
    );
}
