import { ElectronWindow } from "@/components";
import { useAppSelector } from "@/store/hooks";
import React from "react";

const Login: React.FC<Record<string, any>> = () => {
    const value = useAppSelector(state => state.login.value);
    return (
        <ElectronWindow frameless={true}>
            <div>{value}</div>
        </ElectronWindow>
    );
};

export default Login;
