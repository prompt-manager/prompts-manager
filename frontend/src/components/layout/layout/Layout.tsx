import React, { useState } from 'react'
import {
    FileTextOutlined,
    LikeOutlined,
    DatabaseOutlined,
    SunOutlined,
    BulbOutlined,
    PlusOutlined,
    EditOutlined
} from '@ant-design/icons'
import { LayoutProps as AntLayoutProps, MenuProps } from 'antd'
import S_Layout from './Layout.style'
import { Sider, Content, Header, Menu, Switch, Divider } from '../../index'
import { useNavigate } from 'react-router-dom'
import { S_FlexWrapper, S_ThemeSwitch } from '../../../pages/styles/Page.style'

type MenuItem = Required<MenuProps>['items'][number]

interface LayoutProps {
    menuKey: string
    headerTitle?: string | React.ReactNode
}

const MenuItems: MenuItem[] = [
    {
        key: 'prompt',
        icon: <FileTextOutlined />,
        label: 'Prompt',
        children: [
            { key: 'prompt/create', icon: <PlusOutlined />, label: 'Create Prompt' },
            { key: 'prompt/manage', icon: <EditOutlined />, label: 'Manage Prompt' },
        ],
    },
    { key: 'evaluation', icon: <LikeOutlined />, label: 'Evaluation' },
    { key: 'datasets', icon: <DatabaseOutlined />, label: 'Datasets' },
]

const Layout: React.FC<AntLayoutProps & LayoutProps> = ({
    menuKey,
    headerTitle,
    children,
    ...props
}) => {
    const navigate = useNavigate()

    const [selectedMenuKey, setSelectedMenuKey] = useState<string>(menuKey)
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') !== 'light'
    })

    const handleClickMenu = (value: { key: string }) => {
        navigate(`/${value.key}`)
        setSelectedMenuKey(value.key)
    }

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
        setIsDark(!isDark)
    }

    return (
        <S_Layout {...props}>
            <Sider
            >
                <Menu
                    // TODO Home에서 선택해서 들어온 key
                    defaultSelectedKeys={[menuKey]}
                    defaultOpenKeys={['prompt']}
                    selectedKeys={[selectedMenuKey]}
                    mode="inline"
                    // theme="dark"
                    // inlineCollapsed={collapsed}
                    items={MenuItems}
                    onClick={handleClickMenu}
                />
                <S_FlexWrapper flexDirection="column" width="100%">
                    <Divider />
                    <S_ThemeSwitch>
                        <BulbOutlined />Theme Mode
                        <Switch
                          checked={!isDark}
                          checkedChildren={<SunOutlined />}
                          unCheckedChildren={<SunOutlined />}
                          onChange={toggleTheme}
                        />
                    </S_ThemeSwitch>
                </S_FlexWrapper>
            </Sider>
            <S_Layout>
                <Header>{headerTitle}</Header>
                <Content>{children}</Content>
            </S_Layout>
        </S_Layout>
    )
}

export default Layout
