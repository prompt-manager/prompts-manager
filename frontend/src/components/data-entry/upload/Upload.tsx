import React from 'react'
import S_Upload from './Upload.style'
import { UploadProps } from 'antd'

const Upload = ({ ...props }: UploadProps) => {
    return <S_Upload {...props}>{props.children}</S_Upload>
}

export default Upload
