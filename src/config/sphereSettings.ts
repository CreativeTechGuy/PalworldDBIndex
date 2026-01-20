import { createEffect, createSignal, runWithOwner } from "solid-js";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { loadOrDefault } from "./loadOrDefault";

export const [sphereSettings, setSphereSettings] = createSignal(
    loadOrDefault("sphere-settings", {
        healthRemaining: 0.1,
        lifmunkLevel: 0,
        worldSettingCaptureRate: 1,
        minCaptureRateAcceptable: 0.05,
        sphereModuleCaptureStrength: 0,
        isBack: false,
    })
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        const settings = sphereSettings();
        localStorage.setItem("sphere-settings", JSON.stringify(settings));
    });
});

// eslint-disable-next-line solid/reactivity
const defaultSettings = sphereSettings();
export function resetSphereSettings(): void {
    setSphereSettings(defaultSettings);
}
