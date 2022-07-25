import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { addFriendRequest, getUser, permitFriend } from "@/pages/home/api";
import { Avatar, Badge, Input, List, message } from "antd";
import React, { useEffect, useState } from "react";
import { Msg, Stranger } from "@/types";
import { HOST } from "@/core/const";
import { useChatLog, useUser } from "@/hooks";

type Props = {
    setPrivate: (isPrivate: boolean) => void;
    setMembers: (members: string[]) => void;
};

const FriendsList = (props: Props) => {
    const { setPrivate, setMembers } = props;
    const [friends, setFriends] = useState<string[]>([]);
    const [strangers, setStrangers] = useState<Stranger[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [friendsAvatars, setFriendsAvatars] = useState<
        Record<string, string>
    >({});
    const [strangersAvatars, setStrangersAvatars] = useState<
        Record<string, string>
    >({});

    const { chatLog, updateChatLog } = useChatLog();
    const { user, getNewUser } = useUser();

    useEffect(() => {
        getNewUser();
        socket.on("add-friend-request", async () => {
            // 收到添加好友的请求，陌生人列表+1
            getNewUser();
        });
        socket.on("permit-add-friend", async () => {
            getNewUser();
        });
        return () => {
            socket.off("add-friend-request");
            socket.off("permit-add-friend");
        };
    }, []);

    useEffect(() => {
        const friends = user.friends || [];
        setFriends(friends);
        const i = friends.length;
        const arr: Promise<any>[] = [];
        for (let i = 0; i < friends.length; i++) {
            arr.push(getUser(friends[i]));
        }
        // Promise.all(arr).then(res => {

        // })
    }, [user.friends]);

    useEffect(() => {
        if (user) {
            const friends = user.friends || [];
            const strangers = user.strangers || [];
            setFriends(friends);
            setStrangers(strangers);
            friends.forEach(el => {
                getUser(el).then(res => {
                    const {
                        data: { data },
                    } = res;
                    setFriendsAvatars({
                        ...friendsAvatars,
                        [data.name]: data.avatar,
                    });
                });
            });
            strangers.forEach(el => {
                getUser(el.name).then(res => {
                    const {
                        data: { data },
                    } = res;
                    setStrangersAvatars({
                        ...strangersAvatars,
                        [data.name]: data.avatar,
                    });
                });
            });
        }
    }, [user]);

    // 打开右边的聊天框
    const onOpenChatRoom = async (friend: string) => {
        setPrivate(true);
        // 设置 聊天框里的成员
        setMembers([friend]);
        // 并把 所有信息设为已读
        updateChatLog({
            user: user.name,
            friend,
            msg: null,
            removeUnRead: true,
        });
    };

    const onSearchFriend = async (searchName: string) => {
        if (friends.find(el => el === searchName)) {
            message.info("你们已经是好友");
            return;
        }

        const { name } = user;
        const {
            data: { error },
        } = await addFriendRequest({
            friend: searchName,
            me: { name, hello: `我是 ${name}, 想加你为好友` },
        });
        if (error) {
            message.error(error);
            return;
        }
        setSearchValue("");
        message.success("添加好友消息已经发送");
    };

    // 同意添加好友，陌生人列表 -1，朋友列表 +1
    const onPermit = async (friend: string) => {
        // 先去更新数据库，再发消息
        const { name } = user;
        const {
            data: { error },
        } = await permitFriend({
            me: name,
            friend: friend,
        });
        if (error) {
            message.error(error);
            return;
        }
        // 拿到最新用户
        getNewUser();
        //  更新一下chatlog
        updateChatLog({
            user: name,
            friend,
            msg: {
                name: friend,
                msg: "我们已经是好友了, 开始聊天吧",
                date: Date.now(),
                unread: true,
            },
        });
    };

    const renderUnread = (friend: string, chatLog: Record<string, Msg[]>) => {
        const chatHistory = chatLog[friend] || [];
        const msgs = [];
        if (chatHistory) {
            // 从最后一条往上前找所有的未读的信息
            for (let i = chatHistory.length - 1; i >= 0; i--) {
                const log = chatHistory[i];
                if (log.name === friend && log.unread === true) {
                    msgs.push(log);
                }
                if (log.name === friend && !log.unread) {
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
                    el.split("").some(n => searchValue.indexOf(n) > -1)
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
                            <span
                                key="addmit"
                                onClick={() => onPermit(el.name)}
                            >
                                同意
                            </span>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={`${HOST}/static/avatar/${
                                        strangersAvatars[el.name]
                                    }`}
                                >
                                    {el.name.slice(0, 3)}
                                </Avatar>
                            }
                            title={
                                <span style={{ color: "var(--dust-red)" }}>
                                    {el.name}
                                </span>
                            }
                            description={el.hello}
                        />
                    </List.Item>
                )}
            />
        );
    };

    const renderFriends = (friends: string[]) => {
        if (friends.length === 0) {
            return <div></div>;
        }
        return (
            <List
                dataSource={friends}
                renderItem={el => (
                    <List.Item key={el}>
                        <List.Item.Meta
                            avatar={
                                <Badge
                                    size="small"
                                    count={renderUnread(el, chatLog).count}
                                >
                                    <Avatar
                                        src={`${HOST}/static/avatar/${friendsAvatars[el]}`}
                                    >
                                        {el.slice(0, 3)}
                                    </Avatar>
                                </Badge>
                            }
                            title={
                                <span onClick={() => onOpenChatRoom(el)}>
                                    {el}
                                </span>
                            }
                            description={renderUnread(el, chatLog).msg}
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
