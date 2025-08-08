import { Button } from 'antd'
import styled from 'styled-components'
import { ExtendButtonProps } from './Button'

const S_Button = styled(Button)<ExtendButtonProps>`
  border-radius: var(--radius-02);
  width: ${({ fixedSize, extendedSize }) => (fixedSize ? '10rem' : extendedSize ? '100%' : 'auto')};

  // default
  &.ant-btn {
    background: transparent;
    color: var(--button);
    border: 1px solid var(--button);

    &:hover {
      border: 1px solid var(--highlight) !important;
      color: var(--highlight) !important;
      background: transparent !important;
    }

    &:disabled,
    &.ant-btn-disabled {
      color: var(--text-disabled);
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        color: var(--text-disabled) !important;
        text-decoration: none;
      }
    }
  }

  // primary
  &.ant-btn-primary {
    background: var(--button);
    color: var(--white);
    border: none;

    &:hover {
      background: var(--highlight) !important;
      color: var(--white) !important;
    }
  }

  // text
  &.ant-btn-text {
    background: transparent;
    color: var(--button);
    border: none;

    &:hover {
      color: var(--highlight);
      border: none !important;
    }
  }

  // link
  &.ant-btn-link {
    border: none;
    background: transparent;
    color: var(--text-primary);

    &:hover {
      color: var(--highlight);
      border: none !important;
      text-decoration: underline;
    }
  }
`
S_Button.displayName = 'S_Button'

export default S_Button
