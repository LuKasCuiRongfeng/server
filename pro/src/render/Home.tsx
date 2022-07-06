import { Button } from "@mui/material";
import React from "react";

const Home: React.FC<Record<string, any>> = () => {
    return (
        <div>
            <Button variant="contained">点击获取最热</Button>
        </div>
    );
};

export default Home;
