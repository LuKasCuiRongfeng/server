import { User } from "../types";
import { generateCollection } from "../utils";

export const usersConnection = generateCollection<User>("FullStack", "users");
