import styled from 'styled-components'
import { Layout, SiderProps } from 'antd'

export const S_Sider = styled(Layout.Sider)<SiderProps>`
  //z-index: 1;
  //overflow: auto;
  //position: fixed;
  //left: 0;
  //top: 0;
  //bottom: 0;
  height: 100%;

  &.ant-layout-sider {
    min-width: 27.5rem !important;
    background: var(--background);
    padding: 14.7rem var(--spacing-05);
    margin-left: 10%;

    .ant-layout-sider-children {
      //height: 40rem;
      background: var(--background-content);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      padding: var(--spacing-04);
      border-radius: var(--radius-03);
    }
  }
`
S_Sider.displayName = 'S_Sider'
