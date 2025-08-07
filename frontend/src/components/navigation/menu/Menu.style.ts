import { Menu } from 'antd'
import styled from 'styled-components'

const S_Menu = styled(Menu)`
    //height: 100%;
    background-color: var(--background-content);

    .ant-menu-submenu-title {
        color: var(--text-primary);
    }

    .ant-menu-submenu-selected > .ant-menu-submenu-title {
        color: var(--text-primary);
        &:hover {
            color: var(--highlight);
        }
    }

    .ant-menu-item {
        color: var(--text-primary);
        &:hover {
            color: var(--highlight) !important;
        }

        &.ant-menu-item-selected {
            color: var(--text-secondary) !important;
            font-weight: 800;
            border-radius: var(--radius-01);

            &:hover {
                color: var(--highlight) !important;
            }
        }
    }
`

S_Menu.displayName = 'S_Menu'

export default S_Menu
