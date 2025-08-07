import React, { useEffect, useState } from 'react'
import CreatePromptForm from './components/form/CreatePromptForm'
import { Button, Form, Layout } from '../../components'
import { S_FlexWrapper } from '../styles/Page.style'
import { message } from 'antd'
import { postPrompts } from '../../api/service/apiService'

export interface CreatePromptFormValues {
  node_name: string[]
  system: string
  user?: string
  assistant?: string
  message?: string
}

const CreatePrompt = () => {
  const [form] = Form.useForm<CreatePromptFormValues>()
  const [messageApi, contextHolder] = message.useMessage()

  const [promptOrder, setPromptOrder] = useState<('user' | 'assistant')[]>(['user', 'assistant'])

  const handleCreatePrompt = async () => {
    try {
      const { node_name, system, user, assistant, message } = await form.validateFields()

      const getPromptField = (role: 'user' | 'assistant', value: string | undefined) => {
        const trimmed = value?.trim()
        return {
          order: trimmed ? promptOrder.findIndex((p) => p === role) + 2 : null,
          prompt: trimmed || null,
        }
      }
      const parameter = {
        node_name: node_name[0],
        content: {
          system: {
            order: 1,
            prompt: system,
          },
          user: getPromptField('user', user),
          assistant: getPromptField('assistant', assistant),
        },
        message: message?.trim() || null,
      }

      const response = await postPrompts(parameter)

      if (response.status === 'success') {
        messageApi.open({
          type: 'success',
          content: 'Create Successfully.',
        })
      } else {
        messageApi.open({
          type: 'error',
          content: 'Creation failed.',
        })
      }
    } catch (e) {
      console.error('[ERROR] Create Prompt', e)
    }
  }

  const handleChangePromptOrder = () => {
    setPromptOrder((prev) => [...prev].reverse())
  }

  return (
    <>
      {contextHolder}
      <Layout menuKey="prompt/create" headerTitle={<span>Create Prompt</span>}>
        <S_FlexWrapper flexDirection="column" gap={16}>
          <CreatePromptForm
            form={form}
            promptOrder={promptOrder}
            onChangePromptOrder={handleChangePromptOrder}
          />
          <Button type="primary" onClick={handleCreatePrompt}>
            Create prompt
          </Button>
        </S_FlexWrapper>
      </Layout>
    </>
  )
}

export default CreatePrompt
