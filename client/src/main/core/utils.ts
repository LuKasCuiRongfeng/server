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

    const axiosPromissArr = [];

    const read = (i: number) => {
        const end = Math.min(fileSize, (i + 1) * chunkSize);
        const arr = [];

        let curSize = 0;

        const readStream = createReadStream(filePath, {
            start: i * chunkSize,
            end: end - 1,
        });

        readStream.on("data", data => {
            arr.push(data);
            curSize += data.length;
        });

        readStream.on("end", () => {
            // 读完一份，发给渲染进程
            // win.webContents.send(IpcChannel.FILE_UPLOAD, {
            //     fileName,
            //     fileSize,
            //     slices,
            //     curSize,
            //     chunkIndex: i,
            //     data: arr,
            // });
            // 直接用 axios 上传
            const form = new FormData();
            form.append("file", Buffer.from(arr));
            form.append("fileName", fileName);
            form.append("chunkIndex", i);
            form.append("fileSize", fileSize);
            form.append("slices", slices);

            axiosPromissArr.push(
                axios.post(uploadURL, form, {
                    headers: {
                        ...form.getHeaders(),
                        "Content-Type": "multipart/form-data",
                    },
                })
            );

            if (i + 1 < slices) {
                read(i + 1);
            } else {
                axios
                    .all(axiosPromissArr)
                    .then(res => {
                        console.log("success");
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        });
    };

    read(0);
}
