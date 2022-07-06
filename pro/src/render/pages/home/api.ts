import { request } from "../../utils/service";

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
        url: "/recommend/getrecommendlist",
    });
    return res;
}
