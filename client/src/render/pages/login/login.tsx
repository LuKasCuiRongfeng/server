import { windowLogin } from "@/core/ipc";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "./api";

const Login_login: React.FC<Record<string, any>> = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const login = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const {
                data: { status, data, error },
            } = await userLogin(values);
            if (status === "success") {
                message.success("登录成功");
                await windowLogin(data);
            } else {
                message.error(error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item
                    label="用户名"
                    rules={[{ required: true, message: "请输入用户名" }]}
                    name="name"
                >
                    <Input placeholder="用户名" />
                </Form.Item>
                <Form.Item
                    label="密码"
                    rules={[{ required: true, message: "请输入密码" }]}
                    name="password"
                >
                    <Input.Password placeholder="请输入密码" />
                </Form.Item>
            </Form>
            <div style={{ textAlign: "center" }}>
                <Button
                    loading={loading}
                    onClick={() => login()}
                    type="primary"
                >
                    登录
                </Button>
                <Button onClick={() => navigate("/login/register")} type="link">
                    还没有账号? 注册用户
                </Button>
            </div>
        </>
    );
};

export default Login_login;
