import styled from "styled-components";
import { Layout, SiderProps } from "antd";

export const S_Sider = styled(Layout.Sider)<SiderProps>`
    //z-index: 1;
    //overflow: auto;
    //position: fixed;
    //left: 0;
    //top: 0;
    //bottom: 0;
    height: 100%;
    border-right: 1px solid var(--border-default);
    
    &.ant-layout-sider {
        background: var(--background-content);

        .ant-layout-sider-children {
            background: transparent;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-between;
            margin-bottom: var(--spacing-08);
        }
    }
`
S_Sider.displayName = 'S_Sider'

