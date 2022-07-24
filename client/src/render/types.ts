import { Dayjs } from "dayjs";
export interface CommonResponse {
    status: "success" | "failed";
    error: string;
}

export type User = {
    name?: string;
    nickName?: string;
    password?: string;
    friends?: SafeUser[];
    /** 带问候语的strangers */
    strangers?: Stranger[];
    avatar?: string;
};

export type SafeUser = Omit<User, "password" | "friends" | "strangers">;

export type Stranger = SafeUser & { hello?: string };

export type Msg = {
    name: string;
    date: Dayjs;
    msg: string;
    unread?: boolean;
};

export type SuperUser = SafeUser & { unreadLines?: Msg[]; readLines?: Msg[] };

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
    filesize: string;
};
