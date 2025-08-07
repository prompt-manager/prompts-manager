import { Modal, ModalProps } from 'antd'
import styled from 'styled-components'

const S_Modal = styled(Modal)<ModalProps>`
    .ant-modal-content {
        border: 0.2rem solid var(--border-primary);
        background-color: var(--background-content);
        color: var(--text-secondary);
    }

    .ant-modal-header {
        background-color: var(--background-content);
        border-bottom: none;

        .ant-modal-title {
            color: var(--text-primary);
        }
    }

    .ant-modal-body {
        color: var(--text-primary);
    }

    .ant-modal-footer {
        .ant-btn-primary {
            background: var(--background-active);
            color: var(--white);
            border: none;

            .ant-btn-color-primary {
                box-shadow: none;
            }

            &:hover,
            &:focus {
                background-color: var(--highlight);
                border: none;
                color: var(--white);
            }
        }

        .ant-btn-default {
            background-color: transparent;
            border-color: var(--border-interactive);
            color: var(--button);

            &:hover {
                background-color: transparent;
                border-color: var(--highlight);
                color: var(--highlight);
                opacity: 0.8;
            }
        }
    }
`

S_Modal.displayName = 'S_Modal'
export default S_Modal
