import { Form } from 'antd'
import styled from 'styled-components'
import {
    Typo_heading_04_bold,
    Typo_label_02,
} from '../../../styles/constants/typogrphy'
import { ExtendedFormItemProps } from './Form'

export const S_Form = styled(Form)``
S_Form.displayName = 'S_Form'

export const S_FormItem = styled(Form.Item)<ExtendedFormItemProps>`
    width: ${({ width }) => width} !important;

    .ant-form-item-label > label {
        color: var(--blue-z-02);
        ${Typo_label_02}

        &.ant-form-item-required::before {
            color: var(--yellow-z-01) !important;
        }
    }
`
S_FormItem.displayName = 'S_FormItem'

export const S_FormList = styled(Form.List)<ExtendedFormItemProps>`
    width: ${({ width }) => width} !important;

    .ant-form-item-label > label {
        color: var(--blue-z-02);
        ${Typo_label_02}

        &.ant-form-item-required::before {
            color: var(--yellow-z-01) !important;
        }
    }
`
S_FormList.displayName = 'S_FormList'

export const S_FormTitle = styled.h1`
    ${Typo_heading_04_bold};
    color: var(--green-z-01);
`
S_FormTitle.displayName = 'S_FormTitle'
