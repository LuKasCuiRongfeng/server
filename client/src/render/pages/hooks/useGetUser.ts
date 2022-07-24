import { getLocalStore } from "@/core/ipc";
import { User } from "@/types";
import { message } from "antd";
import { useEffect, useState } from "react";
import { getUser } from "../home/api";

export const useGetUser = () => {
    const [user, setUser] = useState<User>();
    useEffect(() => {
        // 拿 userinfo
        getLocalStore("name").then(async res => {
            const {
                data: { error, data },
            } = await getUser(res);
            if (error) {
                message.error(error);
                return;
            }
            setUser(user);
        });
    }, []);

    return user;
};
