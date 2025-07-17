import React from 'react'
import {S_Sider} from "./Sider.style";
import type { SiderProps } from 'antd'

const Sider = ({...props}: SiderProps) => {
    return (
        <S_Sider {...props}/>
    )
}

export default Sider
