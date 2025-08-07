import { Select } from 'antd'
import styled from 'styled-components'
import { ExtendedSelectProps } from './Select'

export const S_Select = styled(Select)<ExtendedSelectProps>`
  width: ${({ width }) => width} !important;

  && .ant-select-selector {
    border: 1px solid var(--border-primary);
    background: var(--background);
    color: var(--white);
  }

  &&:hover .ant-select-selector,
  &&.ant-select-focused .ant-select-selector,
  &&.ant-select-open .ant-select-selector {
    border-color: var(--highlight) !important;
    box-shadow: none !important;
  }

  && .ant-select-selection-item {
    color: var(--white);
  }

  && .ant-select-selection-placeholder {
    color: var(--text-placeholder);
  }

  &&.ant-select-disabled .ant-select-selector {
    background-color: var(--disabled-input);
    color: var(--text-disabled);

    &:hover {
      border-color: var(--border-primary);
    }
  }

  &&.ant-select-disabled .ant-select-selection-placeholder {
    color: var(--text-disabled);
  }

  && .ant-select-arrow {
    color: var(--text-label);
  }

  &&.ant-select-status-error .ant-select-selector {
    background-color: transparent;
    border-color: var(--border-error);
  }
`
S_Select.displayName = 'S_Select'
