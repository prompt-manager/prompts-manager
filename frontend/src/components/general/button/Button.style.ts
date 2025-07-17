import { Button } from 'antd'
import styled from 'styled-components'
import { ExtendButtonProps } from './Button'

const S_Button = styled(Button)<ExtendButtonProps>`
    border-radius: var(--radius-01);
    width: ${({ fixedSize, extendedSize }) =>
        fixedSize ? '10rem' : extendedSize ? '100%' : 'auto'};

    // default
    &.ant-btn {
        background: transparent;
        color: var(--blue-z-03);
        border: 1px solid var(--blue-z-03);

        &:hover {
            border: 1px solid var(--yellow-z-01) !important;
            color: var(--yellow-z-01) !important;
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
        background: var(--blue-z-03);
        color: var(--white);
        border: none;

        &:hover {
            background: var(--yellow-z-01) !important;
            color: var(--white) !important;
        }
    }

    // text
    &.ant-btn-text {
        background: transparent;
        color: var(--blue-z-03);
        border: none;

        &:hover {
            color: var(--yellow-z-01);
            border: none !important;
        }
    }

    // link
    &.ant-btn-link {
        border: none;
        background: transparent;
        color: var(--blue-z-02);

        &:hover {
            color: var(--yellow-z-01);
            border: none !important;
            text-decoration: underline;
        }
    }
`
S_Button.displayName = 'S_Button'

export default S_Button
