import { Hero, User } from "../types";
import { generateCollection } from "../utils";

export const usersConnection = generateCollection<User>("FullStack", "users");

export const lolConnection = generateCollection<Hero>("FullStack", "lol");
