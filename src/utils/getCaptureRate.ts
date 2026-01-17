import gameSettings from "~/raw_data/BP_PalGameSetting.json";
import wildPalsStats from "~/raw_data/DT_PalWildSpawner.json";

type CaptureRate = {
    normal: number;
    backBonus: number;
};

export type MinimumSpheres = Record<string, number>;

const gameSettingsObject = gameSettings.find((entry) => entry.Type === "BP_PalGameSetting_C")!;
const captureJudgeArray = gameSettingsObject.Properties!.CaptureJudgeRateArray;
const sphereArray = gameSettingsObject.Properties!.CaptureSphereLevelMap;
const maxWildPalLevel = Object.values(wildPalsStats[0].Rows)
    .map((item) => Math.max(item.LvMax_1, item.LvMax_2, item.LvMax_3))
    .sort((a, b) => b - a)[0];

export function getMaxPalLevelForSpheres(options: {
    healthRemaining: number;
    lifmunkLevel: number;
    worldSettingCaptureRate: number;
    palIntrinsicCaptureRate: number;
    minCaptureRateAcceptable: number;
    isBack: boolean;
}): MinimumSpheres {
    const maxLevelForSpheres = sphereArray.reduce<MinimumSpheres>((acc, cur) => {
        acc[cur.Key.split("::")[1]] = 1;
        return acc;
    }, {});
    for (let palLevel = 1; palLevel <= maxWildPalLevel; palLevel++) {
        for (const sphere of sphereArray) {
            const captureRates = getCaptureRate({
                palLevel,
                healthRemaining: options.healthRemaining,
                lifmunkLevel: options.lifmunkLevel,
                worldSettingCaptureRate: options.worldSettingCaptureRate,
                palIntrinsicCaptureRate: options.palIntrinsicCaptureRate,
                spherePower: sphere.Value,
            });
            const rate = options.isBack ? captureRates.backBonus : captureRates.normal;
            if (rate >= options.minCaptureRateAcceptable * 100) {
                maxLevelForSpheres[sphere.Key.split("::")[1]] = palLevel;
            }
        }
    }
    return maxLevelForSpheres;
}

export function getCaptureRate(options: {
    palLevel: number;
    healthRemaining: number;
    spherePower: number;
    lifmunkLevel: number;
    worldSettingCaptureRate: number;
    palIntrinsicCaptureRate: number;
}): CaptureRate {
    const scaledLifmunkLevel = options.lifmunkLevel / 2;
    const throwPower = options.spherePower + scaledLifmunkLevel;
    const powerLevelDiff = throwPower - options.palLevel;
    let powerMultiplier;
    if (powerLevelDiff >= 50) {
        powerMultiplier = 1;
    } else if (powerLevelDiff <= -50) {
        powerMultiplier = 0;
    } else {
        powerMultiplier = (powerLevelDiff + 50) / 99;
    }
    const negativeHealthRemaining = options.healthRemaining * -1;
    const powerHealth = Math.pow(1.3, negativeHealthRemaining) * powerMultiplier;
    let baseRate;
    if (powerHealth >= 0.5) {
        baseRate = 1 - Math.pow(-2 * powerHealth + 2, 9) / 2;
    } else {
        baseRate = Math.pow(2, 8) * Math.pow(powerHealth, 9);
    }
    const worldScaledRate = Math.min(
        1,
        Math.max(0, baseRate * options.palIntrinsicCaptureRate * options.worldSettingCaptureRate)
    );
    const judgeScaled = captureJudgeArray.map((scaleValue) => {
        return Math.pow(worldScaledRate, scaleValue);
    });
    const backCaptureRate = judgeScaled[1] * judgeScaled[2];
    const normalCaptureRate = backCaptureRate * judgeScaled[0];
    return {
        normal: Math.pow(normalCaptureRate * 100, 1.3) * 0.25,
        backBonus: Math.pow(backCaptureRate * 100, 1.3) * 0.25,
    };
}
