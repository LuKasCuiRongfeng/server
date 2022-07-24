import React from "react";
import { classnames } from "@/core/utils";
import { ControlId } from "@main/ipc";
import { windowControl } from "@/core/ipc";

const controls = [
    { label: "最小化", icon: "--", id: ControlId.MIN },
    { label: "最大化", icon: "[ ]", id: ControlId.MAX },
    { label: "关闭", icon: "X", id: ControlId.CLOSE },
];

const Control: React.FC<Record<string, any>> = () => {
    return (
        <div className={classnames("window-controls")}>
            {controls.map(e => (
                <div
                    onClick={() => windowControl(e.id)}
                    key={e.label}
                    title={e.label}
                >
                    {e.icon}
                </div>
            ))}
        </div>
    );
};

export default Control;
