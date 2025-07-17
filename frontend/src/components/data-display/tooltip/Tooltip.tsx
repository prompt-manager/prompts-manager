import React from 'react'
import {TooltipProps} from "antd";
import {S_Tooltip} from './Tooltip.style'

const Tooltip = ({ children, ...props}: TooltipProps) => {
    return (
        <S_Tooltip {...props}>{children}</S_Tooltip>
    )
}

export default Tooltip
