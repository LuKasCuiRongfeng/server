import { ElectronWindow } from "@/components";
import React from "react";

const WhatsNew = () => {
    return (
        <ElectronWindow>
            <div style={{ textAlign: "center" }}>
                <h3>关于这款轻量级的多功能(包括即时通讯)应用</h3>
                <ul>
                    <li>
                        后台服务由 <code>nodejs + express + mongodb</code> 编写,
                        轻松应对高并发
                    </li>
                    <li>
                        账号登录占用检测, 如果账号也被占用, 将不允许登录,
                        发出警告
                    </li>
                    <li>
                        处理文件包括上传下载完全使用 <strong>流(stream)</strong>
                        , 解决文件过大导致的长久读不到文件的问题
                    </li>
                    <li>
                        <strong>
                            简单的两人聊天(群聊还在开发中)轻松应对高并发
                        </strong>
                        <ul>
                            <li>
                                <code>socket.io</code>支持, 自动断线重连,
                                再也不用网络不好的问题了
                            </li>
                            <li>
                                搜索陌生人, 加好友, 无论对方是否在线,
                                后台服务为你在恰当的时间恰当处理
                            </li>
                            <li>消息未读提醒</li>
                            <li>
                                聊天记录本次存储, 再也不用担心找不回聊天记录了
                            </li>
                            <li>
                                虽然借助的是 websocket,
                                发消息一点也不用担心对方不在线,
                                强大的本地同步功能同步双方聊天记录
                            </li>
                        </ul>
                    </li>
                </ul>
                <h3>更多后续功能, 敬请期待</h3>
            </div>
        </ElectronWindow>
    );
};

export default WhatsNew;
