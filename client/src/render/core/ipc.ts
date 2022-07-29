import store from "@/store";
import {
    FileUpload,
    FileFilter,
    OpenDialogReturn,
    CommonResponse,
} from "@/types";
import { CrossWinData, WinConstructorOptions } from "@main/core/window-manager";
import { ControlId, IpcChannel } from "@main/ipc";

/** 从本地拿到 electron-store保存的数据 */
export async function getLocalStore(key: string) {
    return window.ipcRenderer.invoke(IpcChannel.ELECTRON_STORE, key);
}

/** 从本地更改 electron-store保存的数据 */
export async function setLocalStore(options: Record<string, any>) {
    await window.ipcRenderer.invoke(IpcChannel.ELECTRON_STORE, options);
}

/** 退出登录 */
export async function userExit() {
    window.ipcRenderer.send(IpcChannel.WINDOW_LOGIN, { exit: true });
}

/** 用户登录 */
export async function windowLogin(name: string) {
    window.ipcRenderer.send(IpcChannel.WINDOW_LOGIN, { name });
}

/** 创建窗口 */
export async function createWin(options: WinConstructorOptions) {
    window.ipcRenderer.send(IpcChannel.CREATE_WIN, options);
}

/** 点击右上角功能按钮 */
export async function windowControl(id: ControlId) {
    window.ipcRenderer.send(IpcChannel.WINDOW_CONTROL, id);
}

/** 监听从 main -> render 的ipc事件 */
export async function registerIpcEvent() {
    window.ipcRenderer.on(IpcChannel.SEND_MSG, (e, args) => {
        // 消息格式必须满足{ type: string, payload: any }
        store.dispatch(args);
    });
}

/**
 * 跨窗口发送消息，原因是每个窗口的 redux 状态数据是独立的
 * 可以访问，但不能直接改变，也不具备响应性，需要通过ipc转发
 * 到另一个窗口
 */
export async function crossWinSendMsg(data: CrossWinData) {
    window.ipcRenderer.send(IpcChannel.SEND_MSG, data);
}

/** 上传文件, 采取的是 stream 的形式上传，可以用于上传大文件 */
export async function uploadFile(options: FileUpload): Promise<
    CommonResponse & {
        data: { newFilename: string; originFilename: string };
    }
> {
    return window.ipcRenderer.invoke(IpcChannel.FILE_UPLOAD, options);
}

/** 文件系统对话框 */
export async function openDialog(
    filters: FileFilter
): Promise<OpenDialogReturn> {
    return window.ipcRenderer.invoke(IpcChannel.OPEN_DIALOG, filters);
}

/** 把小文件转base64，文件不要太大 */
export async function fileToBase64(options: {
    filepath: string;
    type: string;
    maxSize?: number;
}): Promise<CommonResponse & { data: string }> {
    return window.ipcRenderer.invoke(IpcChannel.FILE_TO_BASE64, options);
}
