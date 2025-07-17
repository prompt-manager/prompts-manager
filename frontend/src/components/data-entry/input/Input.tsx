import React from 'react'

import {InputProps } from "antd";
import type { SearchProps } from 'antd/lib/input'
import type { TextAreaProps } from "antd/lib/input";
import {
    S_Input,
    S_InputSearch,
    S_TextArea,
} from './Input.style'

export interface ExtendedInputProps extends InputProps {
    width?: string
}

export interface ExtendedTextAreaProps extends TextAreaProps {
    height?: number
    resize?: boolean
}
export interface ExtendedInputSearchProps extends SearchProps {
    width?: string
}

const Input = ({ ...props }: ExtendedInputProps) => {
    return <S_Input {...props} />
}

export const TextArea =
    ({ ...props }: ExtendedTextAreaProps) => {
        return <S_TextArea {...props} />
    }

export const Search = ({ ...props }: ExtendedInputSearchProps) => {
    return <S_InputSearch {...props} />
}

export default Input
