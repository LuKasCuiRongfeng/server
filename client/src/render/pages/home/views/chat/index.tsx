import { classnames } from "@/core/utils";
import React, { useState } from "react";
import "./index.less";
import FriendsList from "./FriendsList";
import Room from "./room";

const Chat = () => {
    const [isPrivate, setPrivate] = useState(true);
    const [members, setMembers] = useState<string[]>([]);
    return (
        <div className={classnames("chat")}>
            <FriendsList
                setPrivate={p => setPrivate(p)}
                setMembers={m => setMembers(m)}
            />
            <Room isPrivate={isPrivate} members={members} />
        </div>
    );
};

export default Chat;
