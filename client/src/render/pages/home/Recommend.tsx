import socket from "@/core/socket";
import { Button } from "antd";
import React, { useEffect, useState } from "react";

/** 推荐 */
const Recommend: React.FC<Record<string, any>> = () => {
    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    socket.emit("fuck", "can i fuck you");
                    socket.on("fuck", args => {
                        console.log(args);
                    });
                }}
            >
                发送socket消息
            </Button>
        </div>
    );
};

export default Recommend;
