import express from "express";
import {
    addFriend,
    friends,
    getAvatar,
    login,
    register,
} from "../controller/user";

export function userRouter() {
    const router = express.Router();

    router.post("/login", login);

    router.post("/register", register);

    router.get("/friends", friends);

    router.get("/addfriend", addFriend);

    router.get("/getavatar", getAvatar);

    return router;
}
