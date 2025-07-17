import S_Modal from './Modal.style'
import { ModalProps } from 'antd'

const Modal = ({ ...props }: ModalProps) => {
    return <S_Modal centered closable={false} {...props} />
}

export default Modal
