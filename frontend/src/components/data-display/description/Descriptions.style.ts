import styled from 'styled-components'
import { DescriptionsProps, Descriptions } from 'antd'

const S_Descriptions = styled(Descriptions)<DescriptionsProps>`
  .ant-descriptions-view {
    border: 1px solid var(--border-primary) !important;
    border-radius: var(--radius-02);
  }

  .ant-descriptions-row {
    border-bottom: 1px solid var(--border-primary) !important;

    &:last-child {
      border-bottom: none;
    }
  }

  .ant-descriptions-item-label {
    border-right: 1px solid var(--border-primary) !important;
    color: var(--text-primary) !important;
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
