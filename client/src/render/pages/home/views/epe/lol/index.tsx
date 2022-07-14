import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Row,
    Col,
    Input,
    Select,
    InputNumber,
    message,
} from "antd";
import { addHero, getLolHeroList, Hero } from "./api";
import { ColumnsType } from "antd/lib/table";

export const Item = () => {
    const [heros, setHeros] = useState<Hero[]>([]);
    const [visible, setVisible] = useState(false);

    const [form] = Form.useForm();

    const columns: ColumnsType<Hero> = [
        {
            dataIndex: "name",
            key: "name",
            title: "名字",
        },
        {
            dataIndex: "role",
            key: "role",
            title: "角色",
            render: (value, { role }) => {
                let str = "top";
                switch (role) {
                    case "AD":
                        str = "射手";
                        break;
                    case "jungle":
                        str = "打野";
                        break;
                    case "middle":
                        str = "中单";
                        break;
                    case "sup":
                        str = "辅助";
                        break;
                    case "top":
                        str = "上单";
                        break;
                    default:
                        str = "上单";
                }
                return <div>{str}</div>;
            },
        },
        {
            dataIndex: "stars",
            key: "stars",
            title: "星级",
        },
        {
            dataIndex: "difficult",
            key: "difficult",
            title: "上手难度",
            render: (value, { difficult }) => {
                let str = "";
                switch (difficult) {
                    case "easy":
                        str = "容易上手";
                        break;
                    case "normal":
                        str = "不是太难";
                        break;
                    case "difficult":
                        str = "很难上手";
                        break;
                    case "hell":
                        str = "地狱难度";
                        break;
                    default:
                        str = "未知难度";
                }
                return <div>{str}</div>;
            },
        },
    ];

    useEffect(() => {
        query();
    }, []);

    const query = async () => {
        const res = await getLolHeroList();
        if (res.data.status === "success") {
            setHeros(res.data.data);
        }
    };

    return (
        <div>
            <Button onClick={() => setVisible(true)} type="primary">
                添加英雄
            </Button>
            <Table rowKey={r => r.name} dataSource={heros} columns={columns} />
            <Modal
                title="添加lol英雄"
                visible={visible}
                destroyOnClose
                onOk={async () => {
                    try {
                        const values = await form.validateFields();
                        const res = await addHero(values);
                        if (res.data.status === "success") {
                            message.success("添加成功");
                            await query();
                        } else {
                            message.error("添加失败");
                        }
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setVisible(false);
                    }
                }}
                onCancel={() => setVisible(false)}
            >
                <Form
                    form={form}
                    wrapperCol={{ span: 14 }}
                    labelCol={{ span: 10 }}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="名字"
                                name="name"
                                rules={[
                                    { required: true, message: "请填写名字" },
                                ]}
                            >
                                <Input placeholder="名字" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                label="角色"
                                name="role"
                                initialValue="top"
                                rules={[
                                    { required: true, message: "请填写角色" },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="top">
                                        上单
                                    </Select.Option>
                                    <Select.Option value="jungle">
                                        打野
                                    </Select.Option>
                                    <Select.Option value="middle">
                                        中单
                                    </Select.Option>
                                    <Select.Option value="AD">AD</Select.Option>
                                    <Select.Option value="sup">
                                        辅助
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="星级"
                                name="stars"
                                initialValue={3}
                                rules={[
                                    { required: true, message: "请填写星级" },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={1}
                                    max={5}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                label="上手难度"
                                name="difficult"
                                initialValue="normal"
                                rules={[
                                    {
                                        required: true,
                                        message: "请选择上手难度",
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="easy">
                                        简单
                                    </Select.Option>
                                    <Select.Option value="normal">
                                        一般
                                    </Select.Option>
                                    <Select.Option value="difficult">
                                        苦难
                                    </Select.Option>
                                    <Select.Option value="hell">
                                        地狱
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};
