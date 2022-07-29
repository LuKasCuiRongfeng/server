import express from "express";
import {
    addFriendRequest,
    deleteFriend,
    getUser,
    login,
    permitFriend,
    register,
    updateUser,
    uploadFile,
} from "../controller/user";

export function userRouter() {
    const router = express.Router();

    router.post("/login", login);

    router.post("/register", register);

    router.get("/getuser", getUser);

    router.post("/updateuser", updateUser);

    router.post("/addfriendrequest", addFriendRequest);

    router.post("/permitfriend", permitFriend);

    router.post("/uploadfile", uploadFile);

    router.post("/deletefriend", deleteFriend);

    return router;
}
