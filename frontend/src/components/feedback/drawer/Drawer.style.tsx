import { Drawer, DrawerProps } from 'antd'
import styled from 'styled-components'

const S_Drawer = styled(Drawer)<DrawerProps>`
    .ant-drawer-header {
        background: var(--background-z-default) !important;
        position: relative;

        .ant-drawer-close {
            position: absolute;
            right: 1.6rem;
            top: 1.6rem;
            color: var(--blue-z-02);
        }

        .ant-drawer-close {
            color: var(--blue-z-02);
        }
        .ant-drawer-title {
            color: var(--blue-z-02);
        }
    }

    .ant-drawer-body {
        background: var(--background);
        color: var(--blue-z-02);
        padding: 0;
    }
`

S_Drawer.displayName = 'S_Drawer'
export default S_Drawer
