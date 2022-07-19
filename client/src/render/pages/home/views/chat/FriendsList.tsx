import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { addFriend, getFriends } from "@/pages/home/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Avatar, Badge, Button, Input, List, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
    setPrivate: (isPrivate: boolean) => void;
    setMembers: (members: string[]) => void;
    unread: [name: string, msg: string];
};

const FriendsList = (props: Props) => {
    const { setPrivate, setMembers, unread } = props;
    const user = useAppSelector(state => state.home.user);
    const [data, setData] = useState<string[]>([]);
    const [strangers, setStrangers] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [unReadMap, setUnreadMap] = useState<Map<string, string[]>>(
        new Map()
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        query();
        socket.on("add-friend-request", stranger => {
            setStrangers([stranger, ...strangers]);
        });
        socket.on("permitfriend", friend => {
            setStrangers(strangers.filter(el => el !== friend));
            setData([friend, ...data]);
        });
        return () => {
            socket.off("add-friend-request");
            socket.off("permitfriend");
        };
    }, []);

    useEffect(() => {
        setData(user.friends || []);
    }, [user.friends]);

    useEffect(() => {
        const _map = new Map([...unReadMap]);
        const unreadLines = _map.get(unread[0]);
        unreadLines.unshift(unread[1]);
        _map.set(unread[0], unreadLines);
        setUnreadMap(_map);
    }, [unread]);

    const query = async () => {
        const res = await getFriends(user.name);
        if (res.data.status === "success") {
            dispatch({
                type: "home/setUser",
                payload: { ...user, friends: res.data.data },
            });
        }
    };

    const onChangeSearch = (value: string) => {
        setSearchValue(value);
        if (!value) {
            setData(user.friends || []);
            return;
        }
        const filter =
            user.friends?.filter(el =>
                el.split("").some(n => value.indexOf(n) > -1)
            ) || [];
        filter.unshift(`添加$${value}`);
        setData(filter);
    };

    const onClickList = async (friend: string) => {
        const isSearch = friend.indexOf("$") > -1;
        if (isSearch === true) {
            // 加新好友，发送一个消息
            socket.emit("add-friend-request", friend.split("$")[1], user.name);
            message.success("添加好友消息已经发送");
            setData(data.slice(1));
            setSearchValue("");
        } else {
            // 打开右边的聊天框
            setPrivate(true);
            setMembers([friend]);
        }
    };

    const onClickAddmit = async (friend: string) => {
        socket.emit("permitfriend", friend, user.name);
        // 并更新自己的朋友列表
        const res = await addFriend({
            me: user.name,
            friend,
        });
        if (res.data.status === "success") {
            await query();
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
                    dataSource={data}
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
                                        ? unReadMap.get(friend)[0]
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
