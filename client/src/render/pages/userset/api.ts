import { FileUploadDataType, IpcChannel } from "@main/ipc";

/** 上传之前会先拿到文件的统计数据 */
export async function beforeUploadFile(stat: {
    filters: FileUploadDataType["filters"];
    maxSize?: number;
}) {
    const res = await window.ipcRenderer.invoke(IpcChannel.FILE_UPLOAD, {
        stat,
    });
    return res;
}

/** 拿到统计数据之后再上传文件 */
export async function uploadFile(upload: {
    name: string;
    url: string;
    filepath: string;
}) {
    const res = await window.ipcRenderer.invoke(IpcChannel.FILE_UPLOAD, {
        upload,
    });
    return res;
}
