import { setLocalStore } from "@/core/ipc";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Msg } from "@/types";
import { useEffect, useState } from "react";

const useChatLog = () => {
    const [chat, updateChatLog] = useState<{
        user: string;
        friend: string;
        /** 消息 */
        msgs?: Msg[];
        /** 标记为已读 */
        removeUnRead?: boolean;
        /** 替换原来所有的消息 */
        replace?: boolean;
    }>();

    const chatLog = useAppSelector(state => state.home.chatLog);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (chat == null) {
            return;
        }
        const { friend, msgs, removeUnRead, user, replace } = chat;
        const _chatLog = { ...chatLog };
        const chatHistory = [...(_chatLog[friend] || [])];

        if (replace && msgs) {
            // 替换掉原来的消息
            _chatLog[friend] = msgs;
        } else if (removeUnRead) {
            // 把所有的未读信息变成已读，实际上只有对方才有可能有未读信息，自己
            // 的信息肯定是已读的
            // 从最后一条往上前找所有的未读的信息
            for (let i = chatHistory.length - 1; i >= 0; i--) {
                const log = { ...chatHistory[i] };
                if (log.name === friend && log.unread === true) {
                    log.unread = false;
                    chatHistory[i] = log;
                }
                if (log.name === friend && !log.unread) {
                    // 遇到读过了的，立即停止
                    break;
                }
            }
        } else {
            msgs && chatHistory.push(...msgs);
        }

        _chatLog[friend] = chatHistory;

        dispatch({
            type: "home/setChatLog",
            payload: _chatLog,
        });
        // 更新本地的记录
        setLocalStore({
            [`chatLog.${user}.${friend}`]: chatHistory,
        });
    }, [chat]);

    return { chatLog, updateChatLog };
};

export default useChatLog;
