import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { addFriendRequest, getFriends, permitFriend } from "@/pages/home/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Avatar, Badge, Input, List, message } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Msg, SafeUser, Stranger } from "@/types";

type Props = {
    setPrivate: (isPrivate: boolean) => void;
    setMembers: (members: SafeUser[]) => void;
    updateChatLog: (
        friend: SafeUser,
        msg?: Msg,
        removeUnRead?: boolean
    ) => Promise<void>;
};

const FriendsList = (props: Props) => {
    const { setPrivate, setMembers, updateChatLog } = props;
    const [friends, setFriends] = useState<SafeUser[]>([]);
    const [strangers, setStrangers] = useState<Stranger[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const user = useAppSelector(state => state.home.user);
    const chatLog = useAppSelector(state => state.home.chatLog);

    const dispatch = useAppDispatch();

    useEffect(() => {
        queryFriends();
        socket.on("add-friend-request", async () => {
            // 收到添加好友的请求，陌生人列表+1
            await queryFriends();
        });
        socket.on("permit-add-friend", async () => {
            await queryFriends();
        });
        return () => {
            socket.off("add-friend-request");
            socket.off("permit-add-friend");
        };
    }, []);

    useEffect(() => {
        if (user) {
            setFriends(user.friends || []);
            setStrangers(user.strangers || []);
        }
    }, [user]);

    // 查到朋友列表后会去更新 store 里的 user
    // 以便其他地方可以使用
    const queryFriends = async () => {
        const {
            data: { data, status },
        } = await getFriends(user.name);
        if (status === "success") {
            dispatch({
                type: "home/setUser",
                payload: {
                    ...user,
                    friends: data.friends,
                    strangers: data.strangers,
                },
            });
        }
    };

    // 打开右边的聊天框
    const onOpenChatRoom = async (friend: SafeUser) => {
        setPrivate(true);
        // 设置 聊天框里的成员
        setMembers([friend]);
        // 并把 所有信息设为已读
        await updateChatLog(friend, undefined, true);
    };

    const onSearchFriend = async (searchName: string) => {
        if (friends.find(el => el.name === searchName)) {
            message.info("你们已经是好友");
            return;
        }
        const { name, nickName, avatar } = user;
        const {
            data: { error },
        } = await addFriendRequest({
            friend: searchName,
            me: {
                name,
                nickName,
                avatar,
                hello: `我是 ${user.name}, 想加你为好友`,
            },
        });
        if (error) {
            message.error(error);
        }
        setSearchValue("");
        message.success("添加好友消息已经发送");
    };

    // 同意添加好友，陌生人列表 -1，朋友列表 +1
    const onPermit = async (friend: SafeUser) => {
        // 先去更新数据库，再发消息
        const {
            data: { error },
        } = await permitFriend({ me: user, friend: friend });
        if (error) {
            message.error(error);
            return;
        }
        await updateChatLog(friend, {
            name: user.name,
            msg: "我们已经是好友了, 开始聊天吧",
            date: dayjs(),
            unread: true,
        });
    };

    const renderUnread = (friend: SafeUser) => {
        const chatHistory = chatLog[friend.name]?.chatHistory;
        const msgs = [];
        if (chatHistory) {
            // 从最后一条往上前找所有的未读的信息
            for (let i = chatHistory.length - 1; i >= 0; i--) {
                const log = chatHistory[i];
                if (log.name === friend.name && log.unread === true) {
                    msgs.push(log);
                }
                if (log.name === friend.name && !log.unread) {
                    // 遇到读过了的，立即停止
                    break;
                }
            }
        }
        return {
            count: msgs.length,
            msg: msgs[0],
        };
    };

    const renderSearchItem = (searchValue: string) => {
        if (searchValue) {
            const filter =
                user.friends?.filter(el =>
                    el.name.split("").some(n => searchValue.indexOf(n) > -1)
                ) || [];

            // setFriends(filter);

            return (
                <div onClick={() => onSearchFriend(searchValue)}>
                    搜索 <span>{searchValue}</span>
                </div>
            );
        }
        // setFriends(user.friends || []);
        return <div></div>;
    };

    const renderStrangers = (strangers: Stranger[]) => {
        if (strangers.length === 0) {
            return <div></div>;
        }
        return (
            <List
                dataSource={strangers}
                renderItem={el => (
                    <List.Item
                        key={el.name}
                        actions={[
                            <span key="addmit" onClick={() => onPermit(el)}>
                                同意
                            </span>,
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <span style={{ color: "var(--dust-red)" }}>
                                    {el.nickName}
                                </span>
                            }
                            description={el.hello}
                        />
                    </List.Item>
                )}
            />
        );
    };

    const renderFriends = (friends: SafeUser[]) => {
        if (friends.length === 0) {
            return <div></div>;
        }
        return (
            <List
                dataSource={friends}
                renderItem={friend => (
                    <List.Item key={friend.name}>
                        <List.Item.Meta
                            avatar={
                                <Badge
                                    size="small"
                                    count={renderUnread(friend).count}
                                >
                                    <Avatar />
                                </Badge>
                            }
                            title={
                                <span onClick={() => onOpenChatRoom(friend)}>
                                    {friend.name}
                                </span>
                            }
                            description={renderUnread(friend).msg}
                        />
                    </List.Item>
                )}
            />
        );
    };

    return (
        <div className={classnames("chat-left-panel")}>
            <Input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="搜索好友或者添加好友"
            />
            <div className={classnames("chat-left-panel-list")}>
                {renderSearchItem(searchValue)}
                {renderStrangers(strangers)}
                {renderFriends(friends)}
            </div>
        </div>
    );
};

export default FriendsList;
