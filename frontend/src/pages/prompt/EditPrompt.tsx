import { S_FlexWrapper } from '../styles/Page.style'
import React from 'react'
import { Button, Layout, Tooltip } from '../../components'
import PromptManageTable from './components/table/PromptManageTable'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const EditPromptPage = () => {
    const navigate = useNavigate()

    const handleClickCreate = () => {
        navigate('/prompt/create')
    }

    return (
        <Layout
            menuKey="prompt/manage"
            headerTitle={<span>Manage Prompt</span>}
        >
            <S_FlexWrapper flexDirection="column" gap={16}>
                <S_FlexWrapper justifyContent="flex-end">
                    <Tooltip title="New prompt">
                        <Button type="text" onClick={handleClickCreate}>
                            <PlusOutlined />
                        </Button>
                    </Tooltip>
                </S_FlexWrapper>
                <PromptManageTable />
            </S_FlexWrapper>
        </Layout>
    )
}

export default EditPromptPage
