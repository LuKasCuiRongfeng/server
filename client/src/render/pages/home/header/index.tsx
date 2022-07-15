import React, { useState, useRef } from "react";
import { classnames } from "@/core/utils";
import "./style.less";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { homeRoute } from "../route";
import { generateAntdMenuItems } from "@/router";
import { useAppSelector } from "@/store/hooks";
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
                                <div>{t(d.label)}</div>
                            </Dropdown>
                        ) : (
                            <div
                                onClick={() => navigate("/home")}
                                className={classnames("header-logo")}
                            >
                                {t(d.label)}
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
