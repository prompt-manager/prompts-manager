import React from 'react'
import S_Tag from './Tag.style'
import { TagProps } from 'antd'

type CustomTagType = 'full' | 'outline'

interface ExtendedTagProps extends TagProps {
  color?: string
  type?: CustomTagType
  onClick?: () => void
}

const Tag = ({ color = '#3aafc7', type = 'full', onClick, ...props }: ExtendedTagProps) => {
  const clickable = !!onClick
  return (
    <S_Tag $color={color} $tagType={type} $clickable={clickable} onClick={onClick} {...props} />
  )
}

export default Tag
