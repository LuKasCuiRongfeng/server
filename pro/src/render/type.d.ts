import { IpcChannelType, IpcDataType } from "@main/ipc";

export interface IpcRenderer {
    send: (channel: IpcChannelType, args: IpcDataType) => void;
    invoke: (channel: IpcChannelType, args: IpcDataType) => Promise<any>;
    onMsg: (callback: () => any) => void;
}

declare global {
    interface Window {
        ipcRenderer: IpcRenderer;
    }
}
