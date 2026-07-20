export type SpawnData = Partial<
    Record<
        string,
        {
            dayTimeLocations: {
                Locations: { X: number; Y: number; Z: number }[];
                Radius: number;
            };
            nightTimeLocations: {
                Locations: { X: number; Y: number; Z: number }[];
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
