import { Upload } from 'antd'
import styled from 'styled-components'
import { UploadProps } from 'antd'

const S_Upload = styled(Upload)<UploadProps>`
    .ant-upload {
        width: 100%;
    }

    .ant-upload.ant-upload-select {
        border-radius: var(--spacing-00) !important;
        border-color: var(--blue-z-03);
    }

    .ant-upload.ant-upload-select:hover {
        border-color: var(--yellow-z-01);
    }

    .ant-upload-list-item {
        border-radius: var(--spacing-00) !important;
        border-color: var(--blue-z-03);
    }

    .ant-upload-list-item:hover {
        border-color: var(--yellow-z-01);
    }
`
S_Upload.displayName = 'S_Upload'
export default S_Upload
