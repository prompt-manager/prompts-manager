import { Input } from 'antd'
import styled from 'styled-components'
import { ExtendedTextAreaProps } from './Input'

export const S_Input = styled(Input)`
  width: ${({ width }) => width} !important;

  &.ant-input {
    background: var(--background);
    border: 1px solid var(--green-z-01);
    color: var(--white);

    &:hover,
    &:focus {
      background: var(--background);
      border-color: var(--yellow-z-01);
      box-shadow: none;
    }

    &::placeholder {
      color: var(--text-placeholder);
    }

    &:disabled {
      background: var(--disabled-input);
      border-color: var(--green-z-01);
      color: var(--text-disabled);

      &::placeholder {
        color: var(--text-disabled);
      }
    }
  }

  &.ant-input-affix-wrapper {
    background: var(--background) !important;
    border: 1px solid var(--green-z-01);
    color: var(--white);

    &:hover {
      background: var(--background) !important;
      border-color: var(--yellow-z-01);
    }

    &.ant-input-affix-wrapper-focused {
      background: var(--background) !important;
      border-color: var(--yellow-z-01);
      box-shadow: none;
    }

    .ant-input-prefix {
      color: var(--white);
    }

    input {
      background: transparent;
      color: var(--white);

      &::placeholder {
        color: var(--text-placeholder);
      }

      &:focus {
        background: transparent;
      }
    }

    &.ant-input-affix-wrapper-disabled {
      background: var(--disabled-input) !important;

      input {
        color: var(--text-disabled);
        background: var(--disabled-input);
      }
    }
  }

  &.ant-input-status-error {
    background: transparent !important;
    border-color: var(--border-error);
  }
`
S_Input.displayName = 'S_Input'

export const S_TextArea = styled(Input.TextArea)<ExtendedTextAreaProps>`
  height: ${({ height }) => height}px !important;
  resize: ${({ resize }) => (resize ? '' : 'none')} !important;

  background: var(--background);
  border: 1px solid var(--green-z-01);
  color: var(--white);

  &:focus,
  &.ant-input-focused {
    background: var(--background);
    border: 1px solid var(--yellow-z-01);
  }

  &::placeholder {
    color: var(--text-placeholder);
    opacity: 1;
  }

  &:hover {
    background: var(--background);
    border: 1px solid var(--yellow-z-01);
  }

  &.ant-input-disabled,
  textarea:disabled {
    background-color: var(--disabled-input) !important;
    border: 1px solid var(--green-z-01);
    color: var(--text-disabled);

    &::placeholder {
      color: var(--text-disabled);
      opacity: 1;
    }
  }

  &.ant-input-status-error {
    background: transparent !important;
    border-color: var(--error);
  }
`
S_TextArea.displayName = 'S_TextArea'

export const S_InputSearch = styled(Input.Search)`
  width: ${({ width }) => width} !important;

  .ant-input {
    background: var(--background);
    border: 1px solid var(--green-z-01);
    color: var(--white);

    &::placeholder {
      color: var(--text-placeholder);
      opacity: 1;
    }

    &:focus {
      background: var(--background);
      border: 1px solid var(--yellow-z-01);
    }

    &:hover {
      background: var(--background);
      border: 1px solid var(--yellow-z-01);
    }

    &:disabled {
      background-color: var(--disabled-input);
      border: 1px solid var(--green-z-01);
      color: var(--text-disabled);

      &::placeholder {
        color: var(--text-disabled);
        opacity: 1;
      }
    }
  }

  .ant-input-affix-wrapper {
    background: var(--background);
    border: 1px solid var(--green-z-01);
    color: var(--white);

    &:hover {
      border: 1px solid var(--yellow-z-01);
    }

    &.ant-input-affix-wrapper-focused {
      border: 1px solid var(--yellow-z-01);
    }

    &.ant-input-affix-wrapper-disabled {
      background-color: var(--disabled-input);
      border: 1px solid var(--green-z-01);
      color: var(--text-disabled);

      input {
        color: var(--text-disabled);
        background-color: var(--disabled-input);
      }

      input::placeholder {
        color: var(--text-disabled);
        opacity: 1;
      }
    }
  }

  .ant-input-search-button {
    border: 0.1rem solid var(--green-z-01);
    background: transparent;
    color: var(--green-z-01) !important;
    height: 3rem;
    &:hover {
      border: 0.1rem solid var(--green-z-01) !important;
      background: var(--background) !important;
      color: var(--yellow-z-01) !important;
    }
  }
`
S_InputSearch.displayName = 'S_InputSearch'
