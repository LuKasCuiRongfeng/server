import { request } from "../../core/service";

export interface CommonResponse {
    status: "success" | "failed";
    error: string;
}

export interface RecommendList {
    content: string;
    degree: number;
}

export async function getRecommendListApi() {
    const res = await request<CommonResponse & { data: RecommendList[] }>({
        url: "/recommend/list",
    });
    return res;
}

export async function getBigFile() {
    const res = await request({
        url: "/bigfile",
    });
    return res;
}
