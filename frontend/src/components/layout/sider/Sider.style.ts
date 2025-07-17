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
`
S_Sider.displayName = 'S_Sider'

