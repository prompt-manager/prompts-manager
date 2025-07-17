import React from 'react'
import type { ButtonProps } from 'antd'
import S_Button from './Button.style'

export interface ExtendButtonProps extends ButtonProps {
    fixedSize?: boolean
    extendedSize?: boolean
}

const Button = ({ ...props }: ExtendButtonProps) => {
    return <S_Button {...props} />
}

export default Button
