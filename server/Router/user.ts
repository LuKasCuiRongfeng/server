import express from "express";
import {
    addFriendRequest,
    getAvatar,
    getUser,
    login,
    permitFriend,
    register,
    uploadAvatar,
} from "../controller/user";

export function userRouter() {
    const router = express.Router();

    router.post("/login", login);

    router.post("/register", register);

    router.get("/getuser", getUser);

    router.post("/addfriendrequest", addFriendRequest);

    router.post("/permitfriend", permitFriend);

    router.get("/getavatar", getAvatar);

    router.post("/uploadavatar", uploadAvatar);

    return router;
}
