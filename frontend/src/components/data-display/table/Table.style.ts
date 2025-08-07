import { Table, TableProps } from 'antd'
import styled from 'styled-components'

const S_TableWrapper = styled.div`
  border-radius: var(--radius-02);
`
S_TableWrapper.displayName = 'S_TableWrapper'

const S_Table = styled(Table)<TableProps>`
  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background-color: transparent;
    color: var(--text-primary);
    font-weight: bold;
    border-bottom: 0.2rem solid var(--border-primary);
  }

  .ant-table-tbody .ant-table-placeholder {
    background: transparent !important;
  }

  .ant-table-thead > tr > th::before {
    background-color: transparent !important;
    opacity: 0.3;
  }

  .ant-table-tbody > tr > td {
    background: transparent;
    color: var(--white);
    border-bottom: 0.1rem solid var(--border-primary);
  }

  .ant-table-tbody > tr:hover > td {
    background: transparent !important;
  }

  .ant-pagination {
    .ant-pagination-item {
      background: transparent;
      border: none;

      a {
        color: var(--text-label);
      }
    }

    .ant-pagination-item-active {
      background: transparent;

      a {
        font-weight: 800;
        color: var(--highlight);
      }
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      background: transparent;
      border: none;

      .ant-pagination-item-link {
        color: var(--text-label);
        background: transparent;
        border: none;
      }
    }
  }
`
S_Table.displayName = 'S_Table'

export { S_TableWrapper, S_Table }
