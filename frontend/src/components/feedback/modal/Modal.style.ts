import { Modal, ModalProps } from 'antd'
import styled from 'styled-components'

const S_Modal = styled(Modal)<ModalProps>`
    .ant-modal-content {
        border: 0.2rem solid var(--green-z-01);
        background-color: var(--blue-z-01);
        color: var(--blue-z-04);
    }

    .ant-modal-header {
        background-color: var(--blue-z-01);
        border-bottom: none;

        .ant-modal-title {
            color: var(--blue-z-02);
        }
    }

    .ant-modal-body {
        color: var(--blue-z-02);
    }

    .ant-modal-footer {
        .ant-btn-primary {
            background: var(--blue-z-03);
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
            border-color: var(--blue-z-03);
            color: var(--blue-z-03);

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
