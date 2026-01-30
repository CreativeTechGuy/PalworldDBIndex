import { createMemo, For, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import { getPalBlueprint } from "~/data/palBlueprints";
import { defaultPalData } from "~/data/palCombinedData";
import { mapCellValue } from "~/utils/mapCellValue";
import { pascalCaseToTitleCase } from "~/utils/pascalCaseToTitleCase";
import type { CustomFieldProps } from "./customFields";

type MovementComponentProperties = Record<string, number | Record<string, number> | { Key: string; Value: number }[]>;

const map: Record<string, string> = {
    InWaterRate: "Water Depth Factor for Swimming",
    HoveringWaterEffectParameterEnableIdleHoveringWaterEffect: "Enable Idle Hovering In Water",
    JumpZVelocity: "Horizontal Jump Velocity",
};

export function Rideable(props: CustomFieldProps<string>): JSXElement {
    const customMoveProperties = createMemo(() => {
        const characterMoveComponent = getPalBlueprint(props.palData.Id, "CharMoveComp");
        if (characterMoveComponent !== undefined) {
            const properties = (characterMoveComponent.Properties ?? {}) as MovementComponentProperties;
            const entries = Object.entries(properties);
            const finalEntries: [string, number][] = [];
            for (const [key, value] of entries) {
                if (value === 1 && key === "AirControl") {
                    continue;
                }
                if (["MaxAcceleration", "SprintMaxSpeed"].includes(key) && value === props.palData.RideSprintSpeed) {
                    continue;
                }
                if (key === "OverrideFlySprintSpeed") {
                    if (value !== props.palData.RideSprintSpeed) {
                        props.updateData({
                            ...props.palData,
                            RideSprintSpeed: value as number,
                        });
                    }
                    finalEntries.push(["GroundSprintSpeed", defaultPalData[props.palData.Id].RideSprintSpeed]);
                    continue;
                }
                if (key === "OverrideFlySpeed") {
                    if (value !== props.palData.RunSpeed) {
                        props.updateData({
                            ...props.palData,
                            RunSpeed: value as number,
                        });
                    }
                    finalEntries.push(["GroundSpeed", defaultPalData[props.palData.Id].RunSpeed]);
                    continue;
                }
                if (key === "OverrideJumpZVelocityMap" && Array.isArray(value)) {
                    for (let i = 0; i < value.length; i++) {
                        finalEntries.push([`JumpZVelocityJump${i + 2}`, value[i].Value]);
                    }
                } else if (typeof value === "object") {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        if (subValue === 0) {
                            continue;
                        }
                        finalEntries.push([`${key}${subKey}`, subValue as number]);
                    }
                } else {
                    finalEntries.push([key, value]);
                }
            }
            if (finalEntries.length === 0) {
                return null;
            }
            return finalEntries.sort((a, b) => {
                return a[0].localeCompare(b[0]);
            });
        }
        return null;
    });
    return (
        <>
            {customMoveProperties() === null ? (
                props.value
            ) : (
                <Hover label={props.value} title="Custom Movement Properties">
                    <table class="table-cell-padding" style={{ "text-wrap": "nowrap", "min-width": "15rem" }}>
                        <For each={customMoveProperties()}>
                            {([key, value]) => (
                                <tr>
                                    <td>{mapPropertyName(key)}</td>
                                    <td>{mapCellValue(value.toString())}</td>
                                </tr>
                            )}
                        </For>
                    </table>
                </Hover>
            )}
        </>
    );
}

function mapPropertyName(name: string): string {
    for (const [source, replacement] of Object.entries(map)) {
        name = name.replaceAll(source, replacement);
    }
    return pascalCaseToTitleCase(name);
}
