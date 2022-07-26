import { join } from "path";
import App from "../app";
import { isDev } from "./utils";

/** URL管理类 */
export class URL {
    constructor(public app: App) {}

    /** 获取窗口加载的地址
     * @param key 窗口的唯一key
     */
    getLoadURL(key: string) {
        const _isDev = isDev();
        if (_isDev === true) {
            return `http://localhost:12345/#/${key}`;
        }
        return join(`file://`, __dirname, `../render/index.html#/${key}`);
    }
}
