export type PlayerType = {
    id?: string;
    name?: string;
    avatar?: number;
    move?: string | null;
    score?: number;
    moveSet?: boolean;
};

export type RoomType = {
    p1?: PlayerType;
    p2?: PlayerType;
    round?: number;
    displayStep?: number;
    isPrivate?: boolean;
    id?: string;
};
