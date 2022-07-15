import { Hero, User } from "../types";
import { generateCollection } from "../utils";

export const users = generateCollection<User>("FullStack", "users");

export const lolheros = generateCollection<Hero>("FullStack", "lolheros");
