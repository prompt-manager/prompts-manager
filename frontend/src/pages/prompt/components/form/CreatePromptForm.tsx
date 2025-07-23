import React, { useEffect, useState } from 'react'
import { Form, Select, TextArea, Input, Tooltip } from '../../../../components'
import { S_Helper, S_ChangeButton } from '../../../styles/Page.style'
import { getPromptsNodes } from '../../../../api/service/apiService'
import { SelectOption } from '../../../../types/common'

interface CreatePromptFormProps {
  form: any
  promptOrder: ('user' | 'assistant')[]
  onChangePromptOrder: () => void
}

const CreatePromptForm = ({ form, promptOrder, onChangePromptOrder }: CreatePromptFormProps) => {
  const [nodeOptions, setNodeOptions] = useState<SelectOption[]>([])

  const fetchPromptsNodes = async () => {
    const response = await getPromptsNodes()

    if (response.status) {
      const options = response.data.map((res) => ({
        label: res.node_name,
        value: res.node_name,
      }))

      setNodeOptions(options)
    }
  }

  useEffect(() => {
    fetchPromptsNodes()
  }, [])

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Node Name"
        name="node_name"
        width="100%"
        rules={[{ required: true, message: 'Please select node name!' }]}
      >
        <Select placeholder="Select a node name" options={nodeOptions} />
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
              <S_ChangeButton onClick={onChangePromptOrder}>
                <Tooltip title="Change order">⇅</Tooltip>
              </S_ChangeButton>
            }
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
