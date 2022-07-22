import socket from "@/core/socket";
import { classnames, timeFormatter } from "@/core/utils";
import { useAppSelector } from "@/store/hooks";
import { Avatar, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMemoizedFn } from "ahooks";
import dayjs, { Dayjs } from "dayjs";
import { getAvatar } from "../../api";

type Props = {
    isPrivate: boolean;
    members: string[];
    unreadLines: Msg[];
    addUnreadLine?: (msg: Msg) => void;
};

export type Msg = {
    name: string;
    date: Dayjs;
    msg: string;
};

const Room = (props: Props) => {
    const { isPrivate, members, addUnreadLine, unreadLines } = props;
    const [msg, setMsg] = useState("");
    const [lines, setLines] = useState<Msg[]>([]);
    const [friendAvatar, setFriendAvatar] = useState("");

    const roomBodyRef = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    const user = useAppSelector(state => state.home.user);

    const socketCb = useMemoizedFn((msg, friend) => {
        // 判断当前是否是正在聊天的对象
        if (members.includes(friend)) {
            // 是正在聊天的对象
            setLines([...lines, { name: friend, date: dayjs(), msg }]);
        } else {
            // 不是正在聊天的对象，在左边列表显示有聊天信息，设置为未读
            addUnreadLine({ name: friend, date: dayjs(), msg });
        }
    });

    useEffect(() => {
        socket.on("private-chat", socketCb);

        return () => {
            socket.off("private-chat");
        };
    }, []);

    useEffect(() => {
        setLines([...lines, ...unreadLines]);
    }, [unreadLines]);

    useEffect(() => {
        if (members.length === 0) {
            return;
        }
        getAvatar(members[0]).then(res => {
            if (res.data.status === "success") {
                setFriendAvatar(res.data.data);
            }
        });
    }, [members]);

    useEffect(() => {
        roomBodyRef.current.scrollTop = roomBodyRef.current.scrollHeight;
    }, [lines]);

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
                        {timeFormatter({ dayStart: line.date })}
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

    const sendMsg = (key: string) => {
        if (key.toLowerCase() === "enter") {
            socket.emit("private-chat", msg, user.name, members);
            setLines([...lines, { name: user.name, date: dayjs(), msg }]);
            setMsg("");
        }
    };
    return (
        <div className={classnames("chat-right-panel")}>
            {/* {members.length === 0 ? (
                "什么也没有, 点击列表开始聊天吧"
            ) : (
                <>
                    <div className={classnames("chat-right-panel-send")}>
                        <Input
                            value={msg}
                            placeholder={t("发送消息")}
                            onChange={e => setMsg(e.target.value)}
                            onKeyUp={e => sendMsg(e.key)}
                            suffix={
                                <span style={{ color: "var(--gray-6)" }}>
                                    enter
                                </span>
                            }
                        />
                    </div>
                    <div className={classnames("chat-right-panel-body")}>
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
            )} */}
            <>
                <div className={classnames("chat-right-panel-send")}>
                    <Input
                        value={msg}
                        placeholder={t("发送消息")}
                        onChange={e => setMsg(e.target.value)}
                        onKeyUp={e => sendMsg(e.key)}
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
                    <div className={classnames("chat-right-panel-body-title")}>
                        {members.join(", ")}
                    </div>
                    {lines.map(line => renderMsgLine(line))}
                </div>
            </>
        </div>
    );
};

export default Room;
