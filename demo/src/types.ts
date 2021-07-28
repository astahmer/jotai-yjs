export interface Player {
    id: string;
    username: string;
    elo: number;
    color: string;
}
export interface Game {
    id: string;
    players: Array<Player>;
    mode: "duel" | "free-for-all";
}
