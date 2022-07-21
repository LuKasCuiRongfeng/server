import { IpcChannel } from "@main/ipc";
import { app, BrowserWindow } from "electron";
import { createReadStream, statSync } from "fs";
import { basename } from "path";
import axios from "axios";
import FormData from "form-data";

/** 当前环境是否是开发环境 */
export function isDev() {
    return !app.isPackaged;
}

/**
 * 上传文件
 * @param filePath 文件路径
 * @param uploadURL 上传路径
 * @param options 选项
 */
export function uploadFile(
    filePath: string,
    uploadURL: string,
    options: {
        /** 分片大小，默认 10M */
        chunkSize?: number;
        win: BrowserWindow;
    }
) {
    const { chunkSize = 10 * 1024 * 1024, win } = options;
    const fileName = basename(filePath);
    const fileSize = statSync(filePath).size;

    const slices = Math.ceil(fileSize / chunkSize);

    // 把基本文件信息传给渲染进程
    win.webContents.send(IpcChannel.FILE_UPLOAD, {
        fileName,
        fileSize,
        slices,
    });

    const form = new FormData();
    form.append("file", createReadStream(filePath));

    axios
        .post(uploadURL, form, {
            headers: {
                ...form.getHeaders(),
            },
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
}
