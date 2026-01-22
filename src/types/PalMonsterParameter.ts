import type basicPalData from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalMonsterParameter.json";

export type PalMonsterParameter = Omit<
    (typeof basicPalData)[0]["Rows"][keyof (typeof basicPalData)[0]["Rows"]],
    "MeshRelativeLocation"
>;
