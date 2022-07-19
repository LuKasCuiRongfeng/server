import { classnames } from "@/core/utils";
import React, { useState } from "react";
import "./index.less";
import FriendsList from "./FriendsList";
import Room, { Msg } from "./room";

const Chat = () => {
    const [isPrivate, setPrivate] = useState(true);
    const [members, setMembers] = useState<string[]>([]);
    const [unreadLine, addUnreadLine] = useState<Msg>();
    const [unreadLines, setUnreadLines] = useState<Msg[]>([]);
    return (
        <div className={classnames("chat")}>
            <FriendsList
                setPrivate={p => setPrivate(p)}
                setMembers={m => setMembers(m)}
                setUnreadLines={l => setUnreadLines(l)}
                unreadLine={unreadLine}
            />
            <Room
                addUnreadLine={msg => addUnreadLine(msg)}
                isPrivate={isPrivate}
                members={members}
                unreadLines={unreadLines}
            />
        </div>
    );
};

export default Chat;
