import { Drawer, DrawerProps } from 'antd'
import styled from 'styled-components'

const S_Drawer = styled(Drawer)<DrawerProps>`
    .ant-drawer-header {
        background: var(--background-content) !important;
        position: relative;

        .ant-drawer-close {
            position: absolute;
            right: 1.6rem;
            top: 1.6rem;
            color: var(--text-primary);
        }

        .ant-drawer-close {
            color: var(--text-primary);
        }
        .ant-drawer-title {
            color: var(--text-primary);
        }
    }

    .ant-drawer-body {
        background: var(--background);
        color: var(--text-primary);
        padding: 0;
    }
`

S_Drawer.displayName = 'S_Drawer'
export default S_Drawer
