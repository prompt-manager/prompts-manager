import { Timeline, TimelineProps } from 'antd'
import styled from 'styled-components'

const S_Timeline = styled(Timeline)<TimelineProps>`
    .ant-timeline-item-tail {
        border-color: var(--green-z-01);
    }

    .ant-timeline-item-head {
        background-color: var(--blue-z-02);
        border-color: var(--blue-z-03);
    }

    .ant-timeline-item-content {
        color: var(--white);
    }

    .ant-timeline-item-label {
        color: var(--text-placeholder);
    }
`

S_Timeline.displayName = 'S_Timeline'
export default S_Timeline
