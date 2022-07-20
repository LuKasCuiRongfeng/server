import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { addFriend, getFriends } from "@/pages/home/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Avatar, Badge, Button, Input, List, message } from "antd";
import React, { useEffect, useState } from "react";
import { Msg } from "./room";
import dayjs from "dayjs";

type Props = {
    setPrivate: (isPrivate: boolean) => void;
    setMembers: (members: string[]) => void;
    setUnreadLines: (unreadLines: Msg[]) => void;
    unreadLine: Msg;
};

const FriendsList = (props: Props) => {
    const { setPrivate, setMembers, unreadLine, setUnreadLines } = props;
    const user = useAppSelector(state => state.home.user);
    const [friends, setFriends] = useState<string[]>([]);
    const [strangers, setStrangers] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [unReadMap, setUnreadMap] = useState<Map<string, Msg[]>>(new Map());

    const dispatch = useAppDispatch();

    useEffect(() => {
        query();
        socket.on("add-friend-request", stranger => {
            // 收到添加好友的请求，陌生人列表+1
            setStrangers([stranger, ...strangers]);
        });
        socket.on("permit-add-friend", async friend => {
            // 对方同意添加好友，好友列表 +1
            // 同时需要更新数据库里的好友列表
            // 更新朋友列表有两种情况
            // 1：同意对方添加好友
            // 2：对方同意添加好友
            setFriends([friend, ...friends]);
            addUnreadMsg({
                name: friend,
                date: dayjs(),
                msg: "你们已经是好友了, 开始聊天吧",
            });
            const res = await addFriend({
                me: user.name,
                friend,
            });
            if (res.data.status === "success") {
                // await query();
            } else {
                message.error(res.data.error);
            }
        });
        return () => {
            socket.off("add-friend-request");
            socket.off("permit-add-friend");
        };
    }, []);

    useEffect(() => {
        setFriends(user.friends || []);
    }, [user.friends]);

    useEffect(() => {
        unreadLine && addUnreadMsg(unreadLine);
    }, [unreadLine]);

    const query = async () => {
        const res = await getFriends(user.name);
        // 查到朋友列表后会去更新 store 里的 user
        // 以便其他地方可以使用
        if (res.data.status === "success") {
            dispatch({
                type: "home/setUser",
                payload: { ...user, friends: res.data.data },
            });
        }
    };

    const addUnreadMsg = (msg: Msg) => {
        const _map = new Map([...unReadMap]);
        const unreadLines = _map.get(msg.name) || [];
        unreadLines.unshift(msg);
        _map.set(msg.name, unreadLines);
        setUnreadMap(_map);
    };

    const onChangeSearch = (value: string) => {
        setSearchValue(value);
        if (!value) {
            setFriends(user.friends || []);
            return;
        }
        // 只要某个字匹配上了，就算匹配上
        const filter =
            user.friends?.filter(el =>
                el.split("").some(n => value.indexOf(n) > -1)
            ) || [];
        // 朋友列表的第一行显示可以添加搜索人
        filter.unshift(`添加$${value}`);
        setFriends(filter);
    };

    const onClickList = async (friend: string) => {
        const isSearch = friend.indexOf("$") > -1;
        if (isSearch === true) {
            // 加新好友，发送一个消息
            socket.emit("add-friend-request", friend.split("$")[1], user.name);
            message.success("添加好友消息已经发送");
            setFriends(friends.slice(1));
            setSearchValue("");
        } else {
            // 打开右边的聊天框
            setPrivate(true);
            // 设置 聊天框里的成员
            setMembers([friend]);
            setUnreadLines(unReadMap.get(friend) || []);
            unReadMap.set(friend, []);
        }
    };

    const onClickAddmit = async (friend: string) => {
        // 同意添加好友，陌生人列表 -1，朋友列表 +1
        socket.emit("permit-add-friend", friend, user.name);
        setStrangers(strangers.filter(el => el !== friend));
        setFriends([friend, ...friends]);

        addUnreadMsg({
            name: friend,
            date: dayjs(),
            msg: "你们已经是好友了, 开始聊天吧",
        });
        // 更新数据库的朋友列表
        const res = await addFriend({
            me: user.name,
            friend,
        });
        if (res.data.status === "success") {
            // await query();
        } else {
            message.error(res.data.error);
        }
    };
    return (
        <div className={classnames("chat-left-panel")}>
            <Input
                value={searchValue}
                onChange={e => onChangeSearch(e.target.value)}
                placeholder="搜索好友或者添加好友"
            />
            <div className={classnames("chat-left-panel-list")}>
                <List
                    dataSource={strangers}
                    renderItem={el => (
                        <List.Item
                            key={el}
                            actions={[
                                <Button
                                    key="addmit"
                                    onClick={() => onClickAddmit(el)}
                                    type="link"
                                >
                                    同意
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <span style={{ color: "var(--dust-red)" }}>
                                        {el}
                                    </span>
                                }
                            />
                        </List.Item>
                    )}
                />
                <List
                    dataSource={friends}
                    renderItem={friend => (
                        <List.Item key={friend}>
                            <List.Item.Meta
                                avatar={
                                    <Badge
                                        size="small"
                                        count={
                                            unReadMap.get(friend)
                                                ? unReadMap.get(friend).length
                                                : 0
                                        }
                                    >
                                        <Avatar />
                                    </Badge>
                                }
                                title={
                                    <a onClick={() => onClickList(friend)}>
                                        {friend}
                                    </a>
                                }
                                description={
                                    unReadMap.get(friend)
                                        ? unReadMap.get(friend)[0]?.msg
                                        : ""
                                }
                            />
                        </List.Item>
                    )}
                ></List>
            </div>
        </div>
    );
};

export default FriendsList;
