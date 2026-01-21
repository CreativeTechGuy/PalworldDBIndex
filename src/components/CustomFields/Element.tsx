import { createMemo, For, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import { mapCellValue } from "~/utils/mapCellValue";
import type { CustomFieldProps } from "./customFields";

const weaknesses = {
    Electric: ["Ground"],
    Water: ["Electric"],
    Fire: ["Water"],
    Grass: ["Fire"],
    Ground: ["Grass"],
    Ice: ["Fire"],
    Dragon: ["Ice"],
    Dark: ["Dragon"],
    Neutral: ["Dark"],
};

const strengths = {
    Electric: ["Water"],
    Water: ["Fire"],
    Fire: ["Ice", "Grass"],
    Grass: ["Ground"],
    Ground: ["Electric"],
    Ice: ["Dragon"],
    Dragon: ["Ice"],
    Dark: ["Neutral"],
    Neutral: [],
};

export function Element(props: CustomFieldProps<string>): JSXElement {
    const types = createMemo(() =>
        [mapCellValue(props.palData.ElementType1), mapCellValue(props.palData.ElementType2)].filter(
            (item) => item !== ""
        )
    );
    const combinedStrengths = createMemo(() => types().flatMap((item) => strengths[item as keyof typeof strengths]));
    const combinedWeaknesses = createMemo(() => types().flatMap((item) => weaknesses[item as keyof typeof weaknesses]));
    return (
        <>
            {props.value !== "" && (
                <Hover label={mapCellValue(props.value)}>
                    {combinedStrengths().length > 0 && (
                        <>
                            <div class="bold">Pal Strong Against</div>
                            <ul>
                                <For each={combinedStrengths()}>
                                    {(item) => {
                                        if (combinedWeaknesses().includes(item)) {
                                            return null;
                                        }
                                        return <li>{item}</li>;
                                    }}
                                </For>
                            </ul>
                        </>
                    )}
                    {combinedWeaknesses().length > 0 && (
                        <>
                            <div class="bold">Pal Weak Against</div>
                            <ul>
                                <For each={combinedWeaknesses()}>
                                    {(item) => {
                                        if (combinedStrengths().includes(item)) {
                                            return null;
                                        }
                                        return <li>{item}</li>;
                                    }}
                                </For>
                            </ul>
                        </>
                    )}
                </Hover>
            )}
        </>
    );
}
