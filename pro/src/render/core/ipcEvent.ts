import store from "@/store";
import { IpcChannel } from "@main/ipc";

/** 渲染进程监听事件 */
export function registerIpcEvent() {
    // 监听回传的消息，包括跨窗口的消息，传入到对应窗口的store里
    window.ipcRenderer.on(IpcChannel.SEND_MSG, (e, args) => {
        // 消息格式必须满足{ type: string, payload: any }
        store.dispatch(args);
    });
}
