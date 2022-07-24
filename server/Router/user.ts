import express from "express";
import {
    addFriendRequest,
    friends,
    getAvatar,
    login,
    permitFriend,
    register,
    uploadAvatar,
} from "../controller/user";

export function userRouter() {
    const router = express.Router();

    router.post("/login", login);

    router.post("/register", register);

    router.get("/friends", friends);

    router.post("/addfriendrequest", addFriendRequest);

    router.get("/permitfriend", permitFriend);

    router.get("/getavatar", getAvatar);

    router.post("/uploadavatar", uploadAvatar);

    return router;
}
