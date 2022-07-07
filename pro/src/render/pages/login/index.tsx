import { useAppSelector } from "@/store/hooks";
import React from "react";

const Login: React.FC<Record<string, any>> = () => {
    const value = useAppSelector(state => state.login.value);
    return <div>{value}</div>;
};

export default Login;
