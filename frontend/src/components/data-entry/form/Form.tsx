import { S_Form, S_FormItem } from './Form.style'
import React, { PropsWithChildren } from 'react'
import { FormProps, FormItemProps, Form as AntForm } from 'antd'

export interface ExtendedFormItemProps extends FormItemProps {
    width?: string
}

const Form = ({ children, ...props }: PropsWithChildren<FormProps>) => {
    return <S_Form {...props}>{children}</S_Form>
}

const FormItem = ({ children, ...props }: ExtendedFormItemProps) => {
    return <S_FormItem {...props}>{children}</S_FormItem>
}

const FormList = AntForm.List

Form.List = FormList
Form.Item = FormItem
Form.useForm = AntForm.useForm

export default Form
