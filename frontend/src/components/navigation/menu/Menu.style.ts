import { Menu } from 'antd'
import styled from 'styled-components'

const S_Menu = styled(Menu)`
    height: 100%;
    background-color: var(--background-z-default);

    .ant-menu-submenu-title {
        color: var(--blue-z-02);
    }

    .ant-menu-submenu-selected > .ant-menu-submenu-title {
        color: var(--blue-z-02);
        &:hover {
            color: var(--yellow-z-01);
        }
    }

    .ant-menu-item {
        color: var(--blue-z-02);
        &:hover {
            color: var(--yellow-z-01) !important;
        }

        &.ant-menu-item-selected {
            color: var(--blue-z-04) !important;
            font-weight: 800;
            border-radius: var(--radius-01);

            &:hover {
                color: var(--yellow-z-01) !important;
            }
        }
    }
`

S_Menu.displayName = 'S_Menu'

export default S_Menu
