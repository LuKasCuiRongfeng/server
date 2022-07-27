import { IpcChannelType, IpcDataType } from "@main/ipc";

export interface IpcRenderer {
    /** 渲染进程到主进程 */
    send: (channel: IpcChannelType, args: IpcDataType) => void;
    /** 渲染进程到主进程，主进程可回复渲染进程，返回一个promise */
    invoke: (channel: IpcChannelType, args: IpcDataType) => Promise<any>;
    /** 渲染进程监听从主进程传来的事件 */
    on: (
        channel: IpcChannelType,
        callback: (e: any, ...args: any[]) => void
    ) => any;
}

export interface Shell {
    openExternal: (
        url: string,
        options?: { activate?: boolean; workingDirectory?: string }
    ) => Promise<void>;
    openPath: (path: string) => Promise<string>;
    beep: () => void;
}

declare global {
    interface Window {
        /** 渲染进程 */
        ipcRenderer: IpcRenderer;
        shell: Shell;
    }
}
