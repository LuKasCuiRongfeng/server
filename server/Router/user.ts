import express from "express";
import multer from "multer";
import {
    addFriend,
    friends,
    getAvatar,
    login,
    register,
    uploadAvatar,
} from "../controller/user";

export function userRouter() {
    const router = express.Router();

    router.post("/login", login);

    router.post("/register", register);

    router.get("/friends", friends);

    router.get("/addfriend", addFriend);

    router.get("/getavatar", getAvatar);

    router.post("/uploadavatar", uploadAvatar);

    return router;
}
