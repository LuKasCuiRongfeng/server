import { Button, Form, Input, message, Modal } from "antd";
import { ElectronWindow } from "@/components";
import { useAppSelector } from "@/store/hooks";
import React, { useState } from "react";
import { User, userLogin, userReg } from "./api";

const Login: React.FC<Record<string, any>> = () => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const [visible, setVisible] = useState(false);

    const login = async () => {
        const values = await form1.validateFields();
        console.log(values);
        const res = await userLogin(values);
        if (res.data.status === "success") {
            message.success("登录成功");
        } else {
            message.error(res.data.error);
        }
    };

    const register = async () => {
        const values = await form2.validateFields();
        const res = await userReg(values);
        if (res.data.status === "success") {
            message.success("注册成功");
        } else {
            message.error(res.data.error);
        }
    };
    return (
        <ElectronWindow>
            <Form
                layout="vertical"
                form={form1}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            >
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
                <Form.Item>
                    <Button onClick={() => login()} type="primary">
                        登录
                    </Button>
                    <Button onClick={() => setVisible(true)} type="link">
                        注册用户
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                visible={visible}
                onOk={() => register()}
                onCancel={() => setVisible(false)}
            >
                <Form
                    form={form2}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >
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
                        rules={[{ required: true, message: "请确认密码" }]}
                        name="surepassword"
                    >
                        <Input.Password placeholder="请确认密码" />
                    </Form.Item>
                </Form>
            </Modal>
        </ElectronWindow>
    );
};

export default Login;
