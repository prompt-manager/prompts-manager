import React from 'react';
import S_Switch from "./Switch.style";
import {SwitchProps} from "antd";

const Switch = ({...props}: SwitchProps) => {
    return (
        <S_Switch {...props} />
    )
}

export default Switch
