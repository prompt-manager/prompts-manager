import styled from 'styled-components'
import { DescriptionsProps, Descriptions } from 'antd'

const S_Descriptions = styled(Descriptions)<DescriptionsProps>`
    .ant-descriptions-view {
        border: 1px solid var(--green-z-01) !important;
        border-radius: var(--radius-01);
    }

    .ant-descriptions-row {
        border-bottom: 1px solid var(--green-z-01) !important;

        &:last-child {
            border-bottom: none;
        }
    }

    .ant-descriptions-item-label {
        border-right: 1px solid var(--green-z-01) !important;
        color: var(--blue-z-02) !important;
        width: 14rem;
        min-width: 14rem;
        max-width: 16rem;
    }

    .ant-descriptions-item-content {
        color: white;
    }
`

S_Descriptions.displayName = 'S_Description'
export default S_Descriptions
