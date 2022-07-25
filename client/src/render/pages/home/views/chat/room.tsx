import socket from "@/core/socket";
import { classnames, timeFormatter } from "@/core/utils";
import { Avatar, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { Msg } from "@/types";
import { getUser } from "../../api";
import { HOST } from "@/core/const";
import { useChatLog, useUser } from "@/hooks";

type Props = {
    isPrivate: boolean;
    members: string[];
};

const Room = (props: Props) => {
    const { isPrivate, members } = props;
    const [msg, setChatMsg] = useState("");
    const [lines, setLines] = useState<Msg[]>([]);

    const [friendAvatar, setFriendAvatar] = useState("");

    const roomBodyRef = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    const { chatLog, updateChatLog } = useChatLog();

    const { user } = useUser();

    const socketCb = useMemoizedFn(async (msg: Msg, friend: string) => {
        // 判断当前是否是正在聊天的对象
        const _msg = { ...msg };
        const current = members.find(el => el === friend);
        if (current != null) {
            // 是正在聊天的对象
            _msg.unread = false;
        } else {
            // 不是正在聊天的对象，在左边列表显示有聊天信息，设置为未读
            _msg.unread = true;
        }
        updateChatLog({ user: user.name, friend, msgs: [_msg] });
    });

    const socketSyncCb = useMemoizedFn((msgs: Msg[], friend: string) => {
        // 回一个消息同步
        socket.emit("sync-chat-reply", sliceMsgs(100), user.name, members[0]);

        // 从后往前按照时间顺序插入，双指针法
        const logs = chatLog[friend] || [];
        const arr = insertMsgs(logs, msgs);
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
        const arr = insertMsgs(logs, msgs);
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
            setLines(chatHistory);
        }
    }, [members, chatLog]);

    useEffect(() => {
        if (members.length === 0) {
            return;
        }

        // 尝试同步聊天记录
        const msgs = sliceMsgs(100);
        socket.emit("sync-chat", msgs, user.name, members[0]);

        getUser(members[0]).then(res => {
            const {
                data: { data },
            } = res;
            setFriendAvatar(data.avatar);
        });
    }, [members]);

    useEffect(() => {
        if (roomBodyRef.current) {
            roomBodyRef.current.scrollTop = roomBodyRef.current.scrollHeight;
        }
    }, [lines]);

    // 尝试去同步双方的聊天记录，因为可能对方在我
    // 没有在线的时候发了消息，我也可能在对方没
    // 在线的时候发了消息
    // 考虑到性能，最多同步最近的我说的100条记录
    // 其余的不再同步
    const sliceMsgs = (length: number) => {
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

    /** 按照时间顺序重新组装 */
    const insertMsgs = (logs1: Msg[], logs2: Msg[]) => {
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
            avatar: `${HOST}/static/avatar/${avatar}`,
        };
    };

    const renderMsgLine = (line: Msg) => {
        return (
            <div
                key={line.date.toString()}
                className={classnames("chat-right-panel-body-line", {
                    "chat-right-panel-body-line-right": line.name === user.name,
                })}
            >
                <div
                    className={classnames("chat-right-panel-body-line-avtator")}
                >
                    <Avatar size={50} src={renderAvatar(line).avatar}>
                        {renderAvatar(line).name}
                    </Avatar>
                </div>
                <div
                    className={classnames("chat-right-panel-body-line-content")}
                >
                    <span
                        className={classnames(
                            "chat-right-panel-body-line-content-time"
                        )}
                    >
                        {timeFormatter({ dayStart: dayjs(line.date) })}
                    </span>
                    <span
                        className={classnames(
                            "chat-right-panel-body-line-content-msg"
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
        if (key.toLowerCase() === "enter") {
            // 更新本地和redux
            const _msg: Msg = {
                name: user.name,
                date: Date.now(),
                msg,
            };
            updateChatLog({ user: user.name, friend, msgs: [_msg] });

            socket.emit("private-chat", _msg, user.name, members);

            setChatMsg("");
        }
    };
    return (
        <div className={classnames("chat-right-panel")}>
            {members.length === 0 ? (
                "什么也没有, 点击列表开始聊天吧"
            ) : (
                <>
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
                    <div
                        ref={roomBodyRef}
                        className={classnames("chat-right-panel-body")}
                    >
                        <div
                            className={classnames(
                                "chat-right-panel-body-title"
                            )}
                        >
                            {members.join(", ")}
                        </div>
                        {lines.map(line => renderMsgLine(line))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Room;
