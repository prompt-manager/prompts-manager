import React from 'react'
import S_Drawer from './Drawer.style'
import { DrawerProps } from 'antd'

interface ExtendDrawerProps extends DrawerProps {
  sizeType?: 'sm' | 'md' | 'lg'
}

const Drawer = ({ sizeType, ...props }: ExtendDrawerProps) => {
  const getWidth = () => {
    if (sizeType === 'sm') {
      return 400
    }
    if (sizeType === 'lg') {
      return 'calc(100% - 198px)'
    }
    return 'calc(100% - 400px)'
  }

  return <S_Drawer width={getWidth()} {...props} />
}

export default Drawer
