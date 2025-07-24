import React from 'react'
import S_Tag from './Tag.style'
import { TagProps } from 'antd'
import { Tooltip } from '../../index'

type CustomTagType = 'full' | 'outline'

interface ExtendedTagProps extends TagProps {
  color?: string
  type?: CustomTagType
  width?: string
  fullText?: string
  children?: React.ReactNode | string
  onClick?: () => void
}

const Tag = ({
  color = '#3aafc7',
  type = 'full',
  width,
  fullText,
  children,
  onClick,
  ...props
}: ExtendedTagProps) => {
  const clickable = !!onClick
  return (
    <S_Tag
      $color={color}
      $tagType={type}
      $clickable={clickable}
      width={width}
      onClick={onClick}
      {...props}
    >
      <Tooltip title={fullText}>{children}</Tooltip>
    </S_Tag>
  )
}

export default Tag
