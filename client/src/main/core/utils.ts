import { IpcChannel } from "@main/ipc";
import { app, BrowserWindow } from "electron";
import { createReadStream, statSync } from "fs";
import { extname } from "path";
import axios from "axios";
import FormData from "form-data";
import { request } from "./service";

/** 当前环境是否是开发环境 */
export function isDev() {
    return !app.isPackaged;
}

/**
 * 上传文件
 */
export async function uploadFile(options: {
    filepath: string;
    url: string;
    name: string;
}) {
    const { filepath, url, name } = options;
    const filesize = statSync(filepath).size;

    const form = new FormData();

    form.append("file", createReadStream(filepath), {
        filename: `${name}${extname(filepath)}`,
    });
    form.append("username", name);
    form.append("filesize", filesize);

    const res = await request({
        url,
        method: "post",
        data: form,
        headers: {
            ...form.getHeaders(),
        },
    });

    return res;
}
