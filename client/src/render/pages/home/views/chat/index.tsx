import { classnames } from "@/core/utils";
import React from "react";
import "./index.less";
import FriendsList from "./FriendsList";
import Room from "./room";

const Chat = () => {
    return (
        <div className={classnames("chat")}>
            <FriendsList />
            <Room />
        </div>
    );
};

export default Chat;
