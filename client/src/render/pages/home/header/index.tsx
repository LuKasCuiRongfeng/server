import React from "react";
import { classnames } from "@/core/utils";
import "./style.less";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { homeRoute } from "../route";
import { generateAntdMenuItems } from "@/router";
import UserSet from "./user";
import Lang from "./lang";
import { useTranslation } from "react-i18next";

const Header: React.FC<Record<string, any>> = () => {
    const navigate = useNavigate();

    const { t } = useTranslation();

    return (
        <div className={classnames("header")}>
            <div className={classnames("header-logo")}>
                <Lang />
            </div>
            <div className={classnames("header-sections")}>
                {homeRoute.children.map(d => (
                    <div
                        className={classnames("header-sections-section")}
                        key={d.path}
                    >
                        {d.children?.length > 0 ? (
                            <Dropdown
                                overlay={
                                    <Menu
                                        items={generateAntdMenuItems(
                                            d.children
                                        )}
                                        onClick={({ key }) => {
                                            navigate(`${d.path}/${key}`);
                                        }}
                                    />
                                }
                            >
                                <div>
                                    {d.icon} <span>{t(d.label)}</span>
                                </div>
                            </Dropdown>
                        ) : (
                            <div
                                onClick={() => navigate(`/home/${d.path}`)}
                                style={{ cursor: "pointer" }}
                            >
                                {d.icon}
                                <span>{t(d.label)}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={classnames("header-login")}>
                <UserSet />
            </div>
        </div>
    );
};

export default Header;
