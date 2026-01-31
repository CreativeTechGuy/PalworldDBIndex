export type SpawnData = Partial<
    Record<
        string,
        {
            dayTimeLocations: {
                locations: { X: number; Y: number; Z: number }[];
                Radius: number;
            };
            nightTimeLocations: {
                locations: { X: number; Y: number; Z: number }[];
                Radius: number;
            };
        }
    >
>;

export type SpawnerData = Record<
    string,
    {
        SpawnerName: string;
        PlacementType: string;
        Location: { X: number; Y: number; Z: number };
        StaticRadius: number;
    }
>;
