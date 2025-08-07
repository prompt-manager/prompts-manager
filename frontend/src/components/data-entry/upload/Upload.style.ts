import { Upload } from 'antd'
import styled from 'styled-components'
import { UploadProps } from 'antd'

export const S_Upload = styled(Upload)<UploadProps>`
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
    border-radius: var(--spacing-01) !important;
    border: 0.2rem solid var(--green-z-01);
    padding: var(--spacing-02);
    height: 3.6rem !important;
    color: var(--blue-z-02);
    background: var(--background);

    &:hover {
      border-color: var(--yellow-z-01);
      background: var(--background) !important;
      cursor: pointer;
    }

    svg {
      color: var(--blue-z-03);
    }
  }

  .ant-upload-list-item:hover {
    border-color: var(--yellow-z-01);
  }
`
S_Upload.displayName = 'S_Upload'

export const S_UploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8rem;
  border: 0.2rem dashed var(--green-z-01);
  border-radius: var(--radius-01);
  background: var(--background);

  &:hover {
    cursor: pointer;
    color: var(--yellow-z-01);
    border: 0.2rem dashed var(--yellow-z-01);

    .anticon {
      color: var(--yellow-z-01);
    }
  }

  .anticon {
    color: var(--green-z-01);
    font-size: 2rem;
  }

  .ant-form-item-has-error & {
    border: 0.1rem dashed var(--border-error);

    .anticon {
      color: var(--error);
    }
  }

  .ant-form-item-has-error &:hover {
    cursor: pointer;
    color: var(--yellow-z-01);
    border: 0.2rem dashed var(--yellow-z-01);

    .anticon {
      color: var(--yellow-z-01);
    }
  }
`
S_UploadContainer.displayName = 'S_UploadContainer'
