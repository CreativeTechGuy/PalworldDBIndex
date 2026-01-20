import type { CombinedData } from "~/data/palCombinedData";

// Out of 100 as shown in-game
type Stats = {
    attack: number;
    hp: number;
    defense: number;
};

/** IVs are 0-100 as shown in game */
export function getPalFinalStats(data: CombinedData, ivs: Stats, palLevel: number, trustLevel: number): Stats {
    return {
        hp:
            500 +
            (data.Hp + data.Friendship_HP * trustLevel) * (1 + (ivs.hp / 100) * 0.3) * 0.5 * palLevel +
            palLevel * 5,
        attack:
            100 +
            (data.ShotAttack + data.Friendship_ShotAttack * trustLevel) *
                (1 + (ivs.attack / 100) * 0.3) *
                0.075 *
                palLevel,
        defense:
            50 +
            (data.Defense + data.Friendship_Defense * trustLevel) * (1 + (ivs.defense / 100) * 0.3) * 0.075 * palLevel,
    };
}
