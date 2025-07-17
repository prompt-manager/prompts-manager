import React from 'react'
import CreatePromptForm from './components/form/CreatePromptForm'
import { Button, Layout } from '../../components'
import { S_FlexWrapper } from '../styles/Page.style'
import { message } from 'antd'

const CreatePrompt = () => {
    const [messageApi, contextHolder] = message.useMessage()

    const handleCreatePrompt = () => {
        // Create
        messageApi.open({
            type: 'success',
            content: 'Create Successfully.',
        })
        // messageApi.open({
        //     type: 'error',
        //     content: 'Creation failed.',
        // })
    }

    return (
        <>
            {contextHolder}
            <Layout
                menuKey="prompt/create"
                headerTitle={<span>Create Prompt</span>}
            >
                <S_FlexWrapper flexDirection="column" gap={16}>
                    <CreatePromptForm />
                    <Button type="primary" onClick={handleCreatePrompt}>
                        Create prompt
                    </Button>
                </S_FlexWrapper>
            </Layout>
        </>
    )
}

export default CreatePrompt
