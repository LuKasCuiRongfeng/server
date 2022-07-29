export interface CommonResponse {
    status: "success" | "failed";
    error: string;
}

export type User = {
    name: string;
    nickName?: string;
    password?: string;
    friends?: string[];
    /** 带问候语的strangers */
    strangers?: Stranger[];
    avatar?: string;
};

export type Stranger = { name: string; hello?: string };

export type Msg = {
    name: string;
    /** 时间，毫秒 */
    date: number;
    msg: string;
    unread?: boolean;
};

export type FileUpload = {
    /** 上传用户 */
    name: string;
    /** 上传地址 */
    url: string;
    /** 文件路径 */
    filepath: string;
    /** 最大限制 */
    maxSize?: number;
};

export type FileFilter = { name: string; extensions: string[] }[];

export type OpenDialogReturn = {
    canceled: boolean;
    filepath: string;
    filesize: number;
};
