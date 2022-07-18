import { classnames } from "@/core/utils";
import { addFriend, getFriends } from "@/pages/home/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { User } from "@/types";
import { Avatar, Input, List, message } from "antd";
import React, { useEffect, useState } from "react";

const FriendsList = () => {
    const user = useAppSelector(state => state.home.user);
    const [data, setData] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const dispatch = useAppDispatch();
    useEffect(() => {
        query();
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
                el.name.split("").some(n => value.indexOf(n) > -1)
            ) || [];
        filter.unshift({ name: `添加$${value}`, isSearch: true });
        setData(filter);
    };

    const onClickList = async (name: string, isSearch: boolean) => {
        if (isSearch === true) {
            // 加新好友
            const res = await addFriend(user.name, name.split("$")[1]);
            if (res.data.status === "success") {
                message.success("成功添加好友, 开始聊天吧");
                setSearchValue("");
                await query();
            } else {
                message.error(res.data.error);
            }
        } else {
            // 打开右边的聊天框
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
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar />}
                                title={
                                    <a
                                        onClick={() =>
                                            onClickList(
                                                item.name,
                                                item.isSearch
                                            )
                                        }
                                    >
                                        {item.name}
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
