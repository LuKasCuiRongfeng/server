import { Request, Response, NextFunction } from "express";

export type User = {
    name: string;
    password: string;
};

export type Hero = {
    name: string;
    role: "top" | "jungle" | "middle" | "AD" | "sup";
    stars: 1 | 2 | 3 | 4 | 5;
    difficult: "normal" | "easy" | "difficult" | "hell";
};

export interface MiddleWare {
    (req?: Request, res?: Response, next?: NextFunction): any;
}
