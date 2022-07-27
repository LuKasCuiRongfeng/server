import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import {
    addFriendRequest,
    deleteFriend,
    getUser,
    permitFriend,
} from "@/pages/home/api";
import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    Input,
    List,
    Menu,
    message,
    Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { Msg, Stranger } from "@/types";
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
            await getNewUser();
        });
        socket.on("permit-add-friend", async friend => {
            await getNewUser();
            updateChatLog({
                user: user.name,
                friend,
                msgs: [
                    {
                        date: Date.now(),
                        name: friend,
                        msg: "我们已经是朋友了, 开始聊天吧",
                        unread: true,
                    },
                ],
            });
        });
        return () => {
            socket.off("add-friend-request");
            socket.off("permit-add-friend");
        };
    }, []);

    useEffect(() => {
        const friends = user.friends || [];
        setFriends(friends);
        const _friendsAvatars = { ...friendsAvatars };
        for (let i = 0; i < friends.length; i++) {
            getUser(friends[i]).then(res => {
                const {
                    data: { data, error },
                } = res;
                if (!error) {
                    _friendsAvatars[data.name] = data.avatar;
                    setFriendsAvatars(_friendsAvatars);
                }
            });
        }
    }, [user.friends]);

    useEffect(() => {
        const strangers = user.strangers || [];
        setStrangers(strangers);
        const _strangersAvatars = { ...strangersAvatars };
        for (let i = 0; i < strangers.length; i++) {
            getUser(strangers[i].name).then(res => {
                const {
                    data: { data, error },
                } = res;
                if (!error) {
                    _strangersAvatars[data.name] = data.avatar;
                    setStrangersAvatars(_strangersAvatars);
                }
            });
        }
    }, [user.strangers]);

    // 打开右边的聊天框
    const onOpenChatRoom = async (friend: string) => {
        setPrivate(true);
        // 设置 聊天框里的成员
        setMembers([friend]);
        // 并把 所有信息设为已读
        updateChatLog({
            user: user.name,
            friend,
            removeUnRead: true,
        });
    };

    const onSearchFriend = async (searchName: string) => {
        if (friends.find(el => el === searchName)) {
            message.info("你们已经是好友");
            return;
        }

        if (searchName === user.name) {
            message.info("你不可以加自己为好友");
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
        await getNewUser();
        //  更新一下chatlog
        updateChatLog({
            user: name,
            friend,
            msgs: [
                {
                    name: friend,
                    msg: "我们已经是好友了, 开始聊天吧",
                    date: Date.now(),
                    unread: true,
                },
            ],
        });
    };

    const renderUnread = (friend: string, chatLog: Record<string, Msg[]>) => {
        const chatHistory = chatLog[friend] || [];
        let count = 0,
            msg = "";
        if (chatHistory) {
            // 从最后一条往上前找所有的未读的信息
            for (let i = chatHistory.length - 1; i >= 0; i--) {
                const log = chatHistory[i];
                if (log.name === friend && log.unread === true) {
                    count++;
                }
                if (log.name === friend) {
                    // 填充朋友的最后一条信息
                    !msg && (msg = log.msg);
                }
                if (log.name === friend && !log.unread) {
                    // 遇到读过了的，立即停止
                    break;
                }
            }
        }
        return {
            count,
            msg,
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
                <div
                    className={classnames("chat-left-panel-list-search")}
                    onClick={() => onSearchFriend(searchValue)}
                >
                    🔍搜索 <strong>{searchValue}</strong>
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
                            <Button
                                type="primary"
                                key="addmit"
                                size="small"
                                onClick={() => onPermit(el.name)}
                            >
                                同意
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar src={strangersAvatars[el.name]}>
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
                    <List.Item
                        key={el}
                        actions={[
                            <Dropdown
                                key="more"
                                overlay={renderFriendActionMenu(el)}
                            >
                                <a onClick={e => e.preventDefault()}>更多</a>
                            </Dropdown>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Badge
                                    size="small"
                                    count={renderUnread(el, chatLog).count}
                                >
                                    <Avatar src={friendsAvatars[el]}>
                                        {el.slice(0, 3)}
                                    </Avatar>
                                </Badge>
                            }
                            title={
                                <div
                                    className={classnames(
                                        "chat-left-panel-list-friends-title"
                                    )}
                                    onClick={() => onOpenChatRoom(el)}
                                >
                                    {el}
                                </div>
                            }
                            description={renderUnread(el, chatLog).msg}
                        />
                    </List.Item>
                )}
            />
        );
    };

    const renderFriendActionMenu = (friend: string) => {
        return (
            <Menu
                items={[
                    {
                        key: "delete",
                        label: "删除好友",
                        danger: true,
                    },
                ]}
                onClick={({ key }) => {
                    if (key === "delete") {
                        Modal.confirm({
                            title: `确定要删除好友 ${friend} 吗? 聊天记录将同时被删除掉, 且不可撤回`,
                            type: "warn",
                            onOk: async () => {
                                const {
                                    data: { error },
                                } = await deleteFriend({
                                    me: user.name,
                                    friend,
                                });
                                if (error) {
                                    message.error(error);
                                    return;
                                }
                                await getNewUser();
                                setMembers([]);
                            },
                        });
                    }
                }}
            ></Menu>
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
