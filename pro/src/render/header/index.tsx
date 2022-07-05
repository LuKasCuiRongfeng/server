import React, { useState, useRef } from "react";
import { classnames } from "@/utils/utils";
import "./style.less";
import { Button, Menu, MenuItem } from "@mui/material";
import { headerRoutes } from "./config";
import { useLocation, useNavigate } from "react-router-dom";

const Header: React.FC<Record<string, any>> = () => {
    const [status, setStatus] = useState<(HTMLElement | null)[]>(
        headerRoutes.map(d => null)
    );

    const navigate = useNavigate();
    const location = useLocation();

    const switchStatus = (index: number, el?: HTMLElement) => {
        const _status = [...status];
        _status[index] = el || null;
        setStatus(_status);
    };
    return (
        <div className={classnames("header")}>
            <div
                onClick={() => navigate("/home")}
                className={classnames("header-logo")}
            >
                logo
            </div>
            <div className={classnames("header-sections")}>
                {headerRoutes.map((d, index) => (
                    <div
                        className={classnames("header-sections-section")}
                        key={d.title}
                    >
                        <Button
                            onClick={e => switchStatus(index, e.currentTarget)}
                        >
                            {d.title}
                        </Button>
                        <Menu
                            anchorEl={status[index]}
                            open={Boolean(status[index])}
                            onClose={() => switchStatus(index)}
                        >
                            {d.children?.map(item => (
                                <MenuItem
                                    onClick={() => {
                                        navigate(`/${d.path}/${item.path}`);
                                    }}
                                    key={item.title}
                                >
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Header;
