import React from 'react'
import {TabsProps} from "antd";
import S_Tabs from "./Tabs.style";

const Tabs = ({...props}: TabsProps) => {
    return (
        <S_Tabs {...props} />
    )
}

export default Tabs
