export type SpawnerData = Record<
    string,
    {
        SpawnerName: string;
        PlacementType: string;
        Location: { X: number; Y: number; Z: number };
        StaticRadius: number;
    }
>;
