import React from "react";
import { classnames } from "@/core/utils";
import { ControlId, IpcChannel } from "@main/ipc";

const controls = [
    { label: "最小化", icon: "--", id: ControlId.MIN },
    { label: "最大化", icon: "[ ]", id: ControlId.MAX },
    { label: "关闭", icon: "X", id: ControlId.CLOSE },
];

const Control: React.FC<Record<string, any>> = () => {
    const onControlClick = (id: ControlId) => {
        window.ipcRenderer.send(IpcChannel.WINDOW_CONTROL, id);
    };
    return (
        <div className={classnames("window-controls")}>
            {controls.map(e => (
                <div
                    onClick={() => onControlClick(e.id)}
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
