import { Upload } from 'antd'
import styled from 'styled-components'
import { UploadProps } from 'antd'

export const S_Upload = styled(Upload)<UploadProps>`
  .ant-upload {
    width: 100%;
  }

  .ant-upload.ant-upload-select {
    border-radius: var(--spacing-00) !important;
    border-color: var(--border-interactive);
  }

  .ant-upload.ant-upload-select:hover {
    border-color: var(--highlight);
  }

  .ant-upload-list-item {
    border-radius: var(--spacing-01) !important;
    border: 0.2rem solid var(--border-interactive);
    padding: var(--spacing-02);
    height: 3.6rem !important;
    color: var(--text-primary);
    background: var(--background);

    &:hover {
      border-color: var(--highlight);
      background: var(--background) !important;
      cursor: pointer;
    }

    svg {
      color: var(--background-active);
    }
  }

  .ant-upload-list-item:hover {
    border-color: var(--highlight);
  }
`
S_Upload.displayName = 'S_Upload'

export const S_UploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8rem;
  border: 0.2rem dashed var(--border-primary);
  border-radius: var(--radius-01);
  background: var(--background);

  &:hover {
    cursor: pointer;
    color: var(--highlight);
    border: 0.2rem dashed var(--highlight);

    .anticon {
      color: var(--highlight);
    }
  }

  .anticon {
    color: var(--text-label);
    font-size: 2rem;
  }

  .ant-form-item-has-error & {
    border: 0.2rem dashed var(--border-error);

    .anticon {
      color: var(--error);
    }
  }

  .ant-form-item-has-error &:hover {
    cursor: pointer;
    color: var(--highlight);
    border: 0.2rem dashed var(--highlight);

    .anticon {
      color: var(--highlight);
    }
  }
`
S_UploadContainer.displayName = 'S_UploadContainer'
