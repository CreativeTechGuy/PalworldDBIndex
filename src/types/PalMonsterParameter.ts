import type basicPalData from "~/raw_data/DT_PalMonsterParameter.json";

export type PalMonsterParameter = Omit<
    (typeof basicPalData)[0]["Rows"][keyof (typeof basicPalData)[0]["Rows"]],
    "MeshRelativeLocation"
>;
