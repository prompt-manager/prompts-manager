import React, { useEffect, useState } from 'react'
import { Form, Select, TextArea, Input, Tooltip, Button } from '../../../../components'
import { S_Helper } from '../../../styles/Page.style'
import { getPromptsNodes } from '../../../../api/service/apiService'
import { SelectOption } from '../../../../types/common'
import { CreatePromptFormValues } from '../../CreatePrompt'
import { FormInstance } from 'antd'

interface CreatePromptFormProps {
  form: FormInstance<CreatePromptFormValues>
  promptOrder: ('user' | 'assistant')[]
  onChangePromptOrder: () => void
}

const CreatePromptForm = ({ form, promptOrder, onChangePromptOrder }: CreatePromptFormProps) => {
  const [nodeOptions, setNodeOptions] = useState<SelectOption[]>([])
  const [isPromptFilled, setIsPromptFilled] = useState<{
    user: boolean
    assistant: boolean
  }>({
    user: false,
    assistant: false,
  })
  const [changeOrderDisabled, setChangeOrderDisabled] = useState<boolean>(true)

  const fetchPromptsNodes = async () => {
    const response = await getPromptsNodes()

    if (response.status === 'success') {
      const options = response.data?.map((res) => ({
        label: res.node_name,
        value: res.node_name,
      }))

      setNodeOptions(options!)
    }
  }

  const handleChangeUserPrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value.trim()) {
      setIsPromptFilled((prev) => ({ ...prev, user: true }))
    } else setIsPromptFilled((prev) => ({ ...prev, user: false }))
  }

  const handleChangeAssistantPrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value.trim()) {
      setIsPromptFilled((prev) => ({ ...prev, assistant: true }))
    } else setIsPromptFilled((prev) => ({ ...prev, assistant: false }))
  }

  const handleChangePrompt = {
    user: handleChangeUserPrompt,
    assistant: handleChangeAssistantPrompt,
  }

  useEffect(() => {
    fetchPromptsNodes()
  }, [])

  useEffect(() => {
    if (isPromptFilled.user && isPromptFilled.assistant) {
      setChangeOrderDisabled(false)
    } else setChangeOrderDisabled(true)
  }, [isPromptFilled])

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Node Name"
        name="node_name"
        width="100%"
        rules={[{ required: true, message: 'Please select node name!' }]}
      >
        <Select mode="tags" maxCount={1} placeholder="Select a node name" options={nodeOptions} />
      </Form.Item>
      <Form.Item
        name="system"
        label="System"
        rules={[{ required: true, message: 'Please input system prompt!' }]}
      >
        <Input placeholder="Enter a system prompt here." />
      </Form.Item>
      {promptOrder?.map((role) => (
        <Form.Item
          key={role}
          name={role}
          label={`${role[0].toUpperCase() + role.slice(1)} (Optional)`}
        >
          <Input
            placeholder={`Enter a ${role} prompt here.`}
            suffix={
              <Button type="text" disabled={changeOrderDisabled} onClick={onChangePromptOrder}>
                <Tooltip title="Change order">⇅</Tooltip>
              </Button>
            }
            onChange={handleChangePrompt[role]}
          />
        </Form.Item>
      ))}
      <Form.Item label="Commit message (Optional)">
        <S_Helper>
          Provide information about the changed made in this version. Helps maintain a clear history
          of prompt iterations.
        </S_Helper>
        <Form.Item name="message">
          <TextArea height={80} resize={false} placeholder="Add commit message..." />
        </Form.Item>
      </Form.Item>
    </Form>
  )
}

export default CreatePromptForm
