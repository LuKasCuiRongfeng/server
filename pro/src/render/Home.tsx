import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getRecommendListApi, RecommendList } from "./api";

const Home: React.FC<Record<string, any>> = () => {
    const [list, setList] = useState<RecommendList[]>([]);

    useEffect(() => {
        getRecommendList();
    }, []);

    const getRecommendList = async () => {
        const {
            data: { status, error, data },
        } = await getRecommendListApi();
        if (status === "success") {
            setList(data);
        }
    };
    return (
        <div>
            {list.map(e => (
                <div key={e.content}>{e.content}</div>
            ))}
        </div>
    );
};

export default Home;
