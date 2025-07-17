import React from 'react'
import S_Drawer from './Drawer.style'
import { DrawerProps } from 'antd'

const Drawer = ({ ...props }: DrawerProps) => {
    const { size } = props

    const width = size === 'large' ? 'calc(100% - 198px)' : 400

    return <S_Drawer width={width} {...props} />
}

export default Drawer
