export interface CommonResponse {
    status: "success" | "failed";
    error: string;
}

export type User = {
    name?: string;
    password?: string;
    friends?: string[];
    socketId?: string;
};

export type Hero = {
    name: string;
    role: "top" | "jungle" | "middle" | "AD" | "sup";
    stars: 1 | 2 | 3 | 4 | 5;
    difficult: "normal" | "easy" | "difficult" | "hell";
};
