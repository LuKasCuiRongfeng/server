import express from "express";
import { login_login, login_register } from "../controller/login";

export function router() {
    const _router = express.Router();

    _router.post("/login", login_login);

    _router.post("/register", login_register);

    return _router;
}
