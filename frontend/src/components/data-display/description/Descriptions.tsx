import React from 'react'
import S_Descriptions from './Descriptions.style'
import { DescriptionsProps } from 'antd'

const Descriptions = ({ ...props }: DescriptionsProps) => {
    return <S_Descriptions {...props} />
}

export default Descriptions
