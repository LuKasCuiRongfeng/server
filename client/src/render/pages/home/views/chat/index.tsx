import { classnames } from "@/core/utils";
import React, { useState } from "react";
import "./index.less";
import FriendsList from "./FriendsList";
import Room from "./room";
import { Msg } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocalStore } from "@/core/ipc";

const Chat = () => {
    const [isPrivate, setPrivate] = useState(true);
    const [members, setMembers] = useState<string[]>([]);

    const chatLog = useAppSelector(state => state.home.chatLog);
    const user = useAppSelector(state => state.home.user);

    const dispatch = useAppDispatch();

    /** 更新历史对话 */
    const updateChatLog = async (
        friend: string,
        msg?: Msg,
        removeUnRead?: boolean
    ) => {
        const _chatLog = { ...chatLog };
        const chatHistory = [...(_chatLog[friend] || [])];
        if (removeUnRead) {
            // 把所有的未读信息变成已读，实际上只有对方才有可能有未读信息，自己
            // 的信息肯定是已读的
            // 从最后一条往上前找所有的未读的信息
            for (let i = chatHistory.length - 1; i >= 0; i--) {
                const log = chatHistory[i];
                if (log.name === friend && log.unread === true) {
                    log.unread = false;
                }
                if (log.name === friend && !log.unread) {
                    // 遇到读过了的，立即停止
                    break;
                }
            }
        } else {
            chatHistory.push(msg);
            _chatLog[friend] = chatHistory;
        }

        dispatch({
            type: "home/setChatLog",
            payload: _chatLog,
        });
        await setLocalStore({
            [`chatLog.${user.name}.${friend}`]: chatHistory,
        });
    };
    return (
        <div className={classnames("chat")}>
            <FriendsList
                updateChatLog={updateChatLog}
                setPrivate={p => setPrivate(p)}
                setMembers={m => setMembers(m)}
            />
            <Room
                updateChatLog={updateChatLog}
                isPrivate={isPrivate}
                members={members}
            />
        </div>
    );
};

export default Chat;
