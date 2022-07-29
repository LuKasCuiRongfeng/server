import { crossWinSendMsg, openDialog, uploadFile } from "@/core/ipc";
import socket from "@/core/socket";
import { classnames } from "@/core/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Avatar, message } from "antd";
import React, { useEffect, useState } from "react";
import { getUser, updateUser } from "../home/api";

const AccountSet = () => {
    const [mask, setMask] = useState(false);

    const user = useAppSelector(state => state.userset.user);

    const dispatch = useAppDispatch();

    const onClickAvatar = async () => {
        const { canceled, filepath, filesize } = await openDialog([
            { name: "Images", extensions: ["png", "jpg"] },
        ]);
        if (canceled) {
            return;
        }

        const { error: fileError, data: fileReturn } = await uploadFile({
            filepath,
            name: user.name,
            url: "/user/uploadfile",
            maxSize: 100 * 1024,
        });

        if (fileError) {
            message.error(fileError);
            return;
        }
        const {
            data: { error },
        } = await updateUser({
            name: user.name,
            avatar: fileReturn.newFilename,
        });

        if (error) {
            message.error(error);
            return;
        }

        const {
            data: { error: userError, data: userData },
        } = await getUser(user.name);

        if (userError) {
            message.error(error);
            return;
        }

        dispatch({
            type: "userset/setUser",
            payload: userData,
        });
        // 刷新首页的头像
        await crossWinSendMsg({
            key: "home",
            data: {
                type: "home/setUser",
                payload: userData,
            },
        });
    };
    return (
        <div className={classnames("user-set-content-set")}>
            <div className={classnames("user-set-content-set-avatar")}>
                <Avatar
                    src={user.avatar}
                    size={80}
                    style={{ backgroundColor: "var(--lime-nature)" }}
                >
                    {user.name?.slice(0, 3)}
                </Avatar>
                <div
                    className={classnames("user-set-content-set-avatar-mask", {
                        "user-set-content-set-avatar-mask-show": mask,
                    })}
                    onMouseOver={() => setMask(true)}
                    onMouseOut={() => setMask(false)}
                    onClick={onClickAvatar}
                >
                    点击更换头像
                </div>
            </div>
        </div>
    );
};

export default AccountSet;
