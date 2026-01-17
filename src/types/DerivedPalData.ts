export const customColumns = ["Id", "Name", "MinimumSphere", "PalDescription"] as const;

export type DerivedPalData = Record<(typeof customColumns)[number], string>;
