import React from "react";

type Props = {
    type: string;
    title?: string;
    color?: string;
    fontSize?: number;
    onClick?: () => void;
    style?: React.CSSProperties;
    className?: string;
};

const Iconfont = ({
    fontSize = 16,
    color,
    type,
    title,
    onClick,
    style,
    className,
}: Props) => {
    return (
        <span
            className={className}
            onClick={onClick}
            style={{ ...style, cursor: "pointer" }}
            title={title}
        >
            <svg fill={color} width={fontSize} height={fontSize}>
                <use xlinkHref={`#icon-${type}`} />
            </svg>
        </span>
    );
};

export default Iconfont;
