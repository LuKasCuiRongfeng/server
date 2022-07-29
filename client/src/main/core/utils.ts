import { app } from "electron";
import { createReadStream, fstat, statSync } from "fs";
import { readFile } from "fs/promises";
import { basename } from "path";
import FormData, { SubmitOptions } from "form-data";
import { request } from "./service";
import { HOST } from "./const";

/** 当前环境是否是开发环境 */
export function isDev() {
    return !app.isPackaged;
}

/** 回调转 promise  */
const formdataSubmit = (params: string | SubmitOptions, formdata: FormData) => {
    return new Promise<string>((resolve, reject) => {
        formdata.submit(params, (err, res) => {
            if (err) {
                return reject(err.message);
            }
            const chunks: Buffer[] = [];
            res.on("data", data => {
                chunks.push(data);
            });
            res.on("close", () => {
                resolve(Buffer.concat(chunks).toString());
            });
        });
    });
};

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

    const form = new FormData({ maxDataSize: Infinity });

    const readStream = createReadStream(filepath);

    form.append("file", readStream, {
        filename: name + "?" + basename(filepath),
    });
    form.append("username", name);

    const res = await formdataSubmit(`${HOST}${url}`, form);

    return JSON.parse(res);

    // form.submit(`http://localhost:2000${url}`, (err, res) => {
    //     res.on("data", data => {
    //         console.log(data.toString())
    //     })
    // })

    // const res = await request({
    //     url,
    //     method: "post",
    //     data: form,
    //     headers: {
    //         ...form.getHeaders(),
    //         "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
    //         maxBodyLength: Infinity,
    //         maxContentLength: Infinity,
    //     },
    // });

    // return res.data;
}

export async function toBase64({
    filepath,
    type,
}: {
    filepath: string;
    type: string;
}) {
    const buffer = await readFile(filepath);
    return `data:${type}/*;base64,` + buffer.toString("base64");
}
