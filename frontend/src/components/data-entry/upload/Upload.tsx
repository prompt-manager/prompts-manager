import React, { useState } from 'react'
import { S_Upload, S_UploadContainer } from './Upload.style'
import { UploadProps } from 'antd'
import { PlusCircleOutlined, PaperClipOutlined } from '@ant-design/icons'

const Upload = ({ ...props }: UploadProps) => {
  const [fileList, setFileList] = useState<any>([])

  const handleChange = ({ fileList: newFileList }: { fileList: any }) => {
    setFileList(newFileList)
  }

  return (
    <S_Upload {...props} fileList={fileList} onChange={handleChange}>
      {fileList.length === 0 && (
        <S_UploadContainer>
          <PlusCircleOutlined />
        </S_UploadContainer>
      )}
    </S_Upload>
  )
}

export default Upload
