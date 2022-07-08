import { omit } from "lodash-es";
import React from "react";
import Titlebar, { TitlebarProps } from "../titlebar";

interface ElectronWindowProps extends TitlebarProps {
    children?: React.ReactNode;
}

const ElectronWindow: React.FC<ElectronWindowProps> = props => {
    const { children } = props;
    return (
        <>
            <Titlebar {...omit(props, ["children"])} />
            {children}
        </>
    );
};

export default ElectronWindow;
