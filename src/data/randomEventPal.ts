import type SupplyIncidentType from "~/raw_data/Pal/Content/Pal/DataTable/Incident/SupplyIncident/DT_SupplyIncident_Pal.json";

const incidents: Record<string, typeof SupplyIncidentType> = import.meta.glob(
    "~/raw_data/Pal/Content/Pal/DataTable/Incident/SupplyIncident/DT_SupplyIncident_Pal*.json",
    { eager: true, import: "default" }
);

const randomEventPal: string[] = [];
for (const incident of Object.values(incidents)) {
    for (const row of Object.values(incident[0].Rows)) {
        const pal = row.CharacterID.Key.replace(/^BOSS_/i, "");
        if (randomEventPal.includes(pal)) {
            continue;
        }
        randomEventPal.push(pal);
    }
}
export { randomEventPal };
