import React from 'react';
import S_Checkbox from "./Checkbox.style";
import {CheckboxProps} from "antd";

const Checkbox = ({...props}: CheckboxProps) => {
    return (
        <S_Checkbox {...props}>{props.children}</S_Checkbox>
    )
}

export default Checkbox
