import { classnames } from "@/core/utils";
import React from "react";
import Control from "./control";
import "./index.less";

export type TitlebarProps = {
    className?: string;
    style?: React.CSSProperties;
    height?: number;
    /** 是否是不带标题栏的窗口窗口仍然可以拖到
     * @default false */
    frameless?: boolean;
};

const Titlebar: React.FC<TitlebarProps> = props => {
    const { className = "", style, height = 40, frameless = false } = props;

    return (
        <div
            className={`${classnames({
                "title-bar": true,
                frameless,
            })} ${className}`}
            style={{ height, ...style }}
        >
            <Control />
        </div>
    );
};

export default Titlebar;
