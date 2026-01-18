import { createEffect, createSignal, runWithOwner } from "solid-js";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { loadOrDefault } from "./loadOrDefault";

export const [sphereSettings, setSphereSettings] = createSignal(
    loadOrDefault("sphere-settings", {
        healthRemaining: 0.1,
        lifmunkLevel: 5,
        worldSettingCaptureRate: 1,
        minCaptureRateAcceptable: 0.05,
        isBack: false,
    })
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        const settings = sphereSettings();
        localStorage.setItem("sphere-settings", JSON.stringify(settings));
    });
});
