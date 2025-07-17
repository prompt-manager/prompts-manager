import React from 'react'
import S_Timeline from './Timeline.style'
import { TimelineProps } from 'antd'

const Timeline = ({ ...props }: TimelineProps) => {
    return <S_Timeline {...props} />
}

export default Timeline
