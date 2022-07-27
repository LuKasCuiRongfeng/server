import socket from "@/core/socket";
import { classnames, timeFormatter } from "@/core/utils";
import { Avatar, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { Msg } from "@/types";
import { getUser } from "../../api";
import { useChatLog, useUser } from "@/hooks";

type Props = {
    isPrivate: boolean;
    members: string[];
};

/** 每次加载 20 条对话 */
const PAGESIZE = 20;
let loadMore = false;

const Room = (props: Props) => {
    const { isPrivate, members } = props;
    const [msg, setChatMsg] = useState("");
    const [lines, setLines] = useState<Msg[]>([]);

    const [friendAvatar, setFriendAvatar] = useState("");

    const [pageCount, setPageCount] = useState(1);

    const roomBodyRef = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    const { chatLog, updateChatLog } = useChatLog();

    const { user } = useUser();

    const socketCb = useMemoizedFn(async (msg: Msg, friend: string) => {
        // 收到消息发出 beep 声音
        window.shell.beep();
        // 判断当前是否是正在聊天的对象
        const _msg = { ...msg };
        const current = members.find(el => el === friend);
        if (current != null) {
            // 是正在聊天的对象
            _msg.unread = false;
            loadMore = false;
        } else {
            // 不是正在聊天的对象，在左边列表显示有聊天信息，设置为未读
            _msg.unread = true;
        }
        updateChatLog({ user: user.name, friend, msgs: [_msg] });
    });

    const socketSyncCb = useMemoizedFn((msgs: Msg[], friend: string) => {
        // 回一个消息同步
        socket.emit(
            "sync-chat-reply",
            sliceLastMsgs(100),
            user.name,
            members[0]
        );

        // 从后往前按照时间顺序插入，双指针法
        const logs = chatLog[friend] || [];
        const arr = syncMsgs(logs, msgs);
        updateChatLog({
            user: user.name,
            friend,
            msgs: arr,
            replace: true,
        });
    });

    const socketSyncReplyCb = useMemoizedFn((msgs: Msg[], friend: string) => {
        // 从后往前按照时间顺序插入，双指针法
        const logs = chatLog[friend] || [];
        const arr = syncMsgs(logs, msgs);
        updateChatLog({
            user: user.name,
            friend,
            msgs: arr,
            replace: true,
        });
    });

    useEffect(() => {
        socket.on("private-chat", socketCb);

        socket.on("sync-chat", socketSyncCb);

        socket.on("sync-chat-reply", socketSyncReplyCb);

        return () => {
            socket.off("private-chat");
            socket.off("sync-chat");
        };
    }, []);

    useEffect(() => {
        if (members.length === 0) {
            return;
        }
        const friend = members[0];
        const chatHistory = chatLog[friend] || [];
        if (chatHistory) {
            setLines(chatHistory.slice(-PAGESIZE * pageCount));
        }
    }, [members, chatLog, pageCount]);

    useEffect(() => {
        if (members.length === 0) {
            return;
        }
        setPageCount(1);
        loadMore = false;

        // 尝试同步聊天记录
        const msgs = sliceLastMsgs(100);
        socket.emit("sync-chat", msgs, user.name, members[0]);

        getUser(members[0]).then(res => {
            const {
                data: { data },
            } = res;
            setFriendAvatar(data.avatar);
        });
    }, [members]);

    useEffect(() => {
        if (roomBodyRef.current && loadMore === false) {
            // 只有来新消息和发消息的时候滚动条才沉底，滚动加载更多不沉底
            roomBodyRef.current.scrollTop = roomBodyRef.current.scrollHeight;
        }
    }, [lines]);

    // 提取最近的一些记录
    const sliceLastMsgs = (length: number) => {
        const msgs: Msg[] = [];
        const logs = chatLog[members[0]] || [];
        for (let i = logs.length - 1; i >= 0; i--) {
            const log = logs[i];
            if (log.name === user.name) {
                // 我说的话
                msgs.unshift(log);
            }
            if (msgs.length === length) {
                // 最多同步
                break;
            }
        }
        return msgs;
    };

    /** 按照时间顺序重新同步消息 */
    const syncMsgs = (logs1: Msg[], logs2: Msg[]) => {
        // 从后往前按照时间顺序插入，双指针法
        const arr: Msg[] = [];
        let i = logs1.length - 1,
            j = logs2.length - 1;
        while (i >= 0 && j >= 0) {
            if (
                logs1[i].date === logs2[j].date &&
                logs1[i].name === logs2[j].name
            ) {
                // 名字时间一样判定为同一条
                arr.unshift(logs1[i]);
                i--;
                j--;
            } else {
                if (logs1[i].date >= logs2[j].date) {
                    arr.unshift(logs1[i--]);
                } else {
                    arr.unshift(logs2[j--]);
                }
            }
        }
        // 把剩余的加上
        while (i >= 0) {
            arr.unshift(logs1[i--]);
        }
        while (j >= 0) {
            arr.unshift(logs2[j--]);
        }

        return arr;
    };

    const renderAvatar = (line: Msg) => {
        const name = line.name === user.name ? user.name : members[0];
        const avatar = line.name === user.name ? user.avatar : friendAvatar;
        return {
            name: name.slice(0, 3),
            avatar,
        };
    };

    const renderMsgLine = (line: Msg) => {
        return (
            <div
                key={line.date.toString()}
                className={classnames("chat-right-panel-lines-line", {
                    "chat-right-panel-lines-line-right":
                        line.name === user.name,
                })}
            >
                <div
                    className={classnames(
                        "chat-right-panel-lines-line-avtator"
                    )}
                >
                    <Avatar size={50} src={renderAvatar(line).avatar}>
                        {renderAvatar(line).name}
                    </Avatar>
                </div>
                <div
                    className={classnames(
                        "chat-right-panel-lines-line-content"
                    )}
                >
                    <span
                        className={classnames(
                            "chat-right-panel-lines-line-content-time"
                        )}
                    >
                        {timeFormatter({ dayStart: dayjs(line.date) })}
                    </span>
                    <span
                        className={classnames(
                            "chat-right-panel-lines-line-content-msg"
                        )}
                    >
                        {line.msg}
                    </span>
                </div>
            </div>
        );
    };

    const sendChatMsg = async (key: string) => {
        const friend = members[0];
        if (key.toLowerCase() === "enter" && msg.trim() !== "") {
            // 更新本地和redux
            const _msg: Msg = {
                name: user.name,
                date: Date.now(),
                msg: msg.trim(),
            };
            updateChatLog({ user: user.name, friend, msgs: [_msg] });

            socket.emit("private-chat", _msg, user.name, members);

            setChatMsg("");
            loadMore = false;
        }
    };

    const onLoadMore = (e: React.UIEvent) => {
        if (e.currentTarget.scrollTop <= 20) {
            loadMore = true;
            setPageCount(pageCount + 1);
        }
    };
    return (
        <div className={classnames("chat-right-panel")}>
            {members.length === 0 ? (
                "什么也没有, 点击列表开始聊天吧"
            ) : (
                <>
                    <div className={classnames("chat-right-panel-title")}>
                        {members.join(", ")}
                    </div>
                    <div
                        ref={roomBodyRef}
                        onScroll={e => onLoadMore(e)}
                        className={classnames("chat-right-panel-lines")}
                    >
                        {lines.map(line => renderMsgLine(line))}
                    </div>
                    <div className={classnames("chat-right-panel-send")}>
                        <Input
                            value={msg}
                            placeholder={t("发送消息")}
                            onChange={e => setChatMsg(e.target.value)}
                            onKeyUp={e => sendChatMsg(e.key)}
                            suffix={
                                <span style={{ color: "var(--gray-6)" }}>
                                    enter
                                </span>
                            }
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Room;
