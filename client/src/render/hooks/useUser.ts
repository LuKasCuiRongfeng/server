import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { User } from "@/types";
import { message } from "antd";
import { useEffect, useState } from "react";
import { getUser } from "../pages/home/api";

const useUser = () => {
    const user = useAppSelector(state => state.home.user);

    const [_user, setUser] = useState<User>();

    const dispatch = useAppDispatch();

    /** 其他接口已经改变了数据里的user，所有拿最新的 */
    const getNewUser = () => {
        // 拿 userinfo
        if (user != null) {
            getUser(user.name).then(res => {
                const {
                    data: { error, data },
                } = res;
                if (error) {
                    message.error(error);
                    return;
                }
                // 拿到新的用户信息，开始更新用户
                dispatch({
                    type: "home/setUser",
                    payload: data,
                });
            });
        }
    };

    return { user, getNewUser, setUser };
};

export default useUser;
