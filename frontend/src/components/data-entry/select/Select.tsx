import React from 'react'
import { SelectProps } from 'antd'
import { S_Select } from './Select.style'

export interface ExtendedSelectProps extends SelectProps {
  width?: string
}

const Select = ({ ...props }: ExtendedSelectProps) => {
  return <S_Select {...props} />
}

export default Select
