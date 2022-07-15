import React, { useState, useRef } from "react";
import { classnames } from "@/core/utils";
import "./style.less";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { homeRoute } from "../route";
import { generateAntdMenuItems } from "@/router";
import { useAppSelector } from "@/store/hooks";
import UserSet from "./user";

const Header: React.FC<Record<string, any>> = () => {
    const navigate = useNavigate();

    return (
        <div className={classnames("header")}>
            <div
                onClick={() => navigate("/home")}
                className={classnames("header-logo")}
            >
                logo
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
                                <div>{d.label}</div>
                            </Dropdown>
                        ) : (
                            <div
                                onClick={() => navigate("/home")}
                                className={classnames("header-logo")}
                            >
                                {d.label}
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
