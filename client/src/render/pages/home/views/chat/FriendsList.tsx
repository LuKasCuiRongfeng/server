import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { addFriend, getFriends } from "@/pages/home/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Avatar, Button, Input, List, message } from "antd";
import React, { useEffect, useState } from "react";

const FriendsList = () => {
    const user = useAppSelector(state => state.home.user);
    const [data, setData] = useState<any[]>([]);
    const [newFriends, setNewFriends] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const dispatch = useAppDispatch();
    useEffect(() => {
        query();
        socket.on("addfriend", name => {
            setNewFriends([name, ...newFriends]);
        });
        socket.on("permitfriend", name => {
            setNewFriends(newFriends.filter(el => el !== name));
            setData([name, ...data]);
        });
        return () => {
            socket.off("addfriend");
            socket.off("permitfriend");
        };
    }, []);

    useEffect(() => {
        setData(user.friends || []);
    }, [user.friends]);

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

    const onClickList = async (name: string) => {
        const isSearch = name.indexOf("$") > -1;
        if (isSearch === true) {
            // 加新好友，发送一个消息
            socket.emit("addfriend", name.split("$")[1], user.name);
        } else {
            // 打开右边的聊天框
        }
    };

    const onClickAddmit = async (name: string) => {
        socket.emit("permitfriend", name, user.name);
        // 并更新自己的朋友列表
        const res = await addFriend({
            me: user.name,
            friend: name,
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
                    dataSource={newFriends}
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
                                avatar={<Avatar />}
                                title={
                                    <a onClick={() => onClickList(friend)}>
                                        {friend}
                                    </a>
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
