import { User } from "@/types";
import { Button, Form, Input, message } from "antd";
import { omit } from "lodash-es";
import React from "react";
import { useNavigate } from "react-router-dom";
import { userReg } from "./api";

const Login_reg: React.FC<Record<string, any>> = () => {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const register = async () => {
        const values = await form.validateFields([
            "name",
            "password",
            "surepassword",
        ]);
        const {
            data: { status, error },
        } = await userReg(omit(values, ["surepassword"]) as User);
        if (status === "success") {
            message.success("注册成功");
            navigate("/login");
        } else {
            message.error(error);
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
                <Form.Item
                    label="确认密码"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (
                                    !value ||
                                    form.getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("两次密码输入不相同 ...")
                                );
                            },
                        },
                    ]}
                    name="surepassword"
                >
                    <Input.Password placeholder="请确认密码" />
                </Form.Item>
            </Form>
            <div style={{ textAlign: "center" }}>
                <Button onClick={() => register()} type="primary">
                    注册
                </Button>
                <Button onClick={() => navigate("/login")} type="link">
                    已有账号? 去登录
                </Button>
            </div>
        </>
    );
};

export default Login_reg;
