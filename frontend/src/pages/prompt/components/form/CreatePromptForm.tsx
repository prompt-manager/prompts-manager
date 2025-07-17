import React from 'react'
import {
    Form,
    Select,
    TextArea,
    Button,
    Input,
    Tooltip,
} from '../../../../components'
import {
    S_Helper,
    S_FlexWrapper,
    S_ChangeButton,
} from '../../../styles/Page.style'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'

const CreatePromptForm = () => {
    const [form] = Form.useForm()

    const promptTypeOptions = [
        { label: 'User', value: 'user' },
        { label: 'Assistant', value: 'assistant' },
    ]

    const moveField = (from: number, to: number) => {
        const current = form.getFieldValue('prompt')
        if (to < 0 || to >= current.length) return

        const updated = [...current]
        const [moved] = updated.splice(from, 1)
        updated.splice(to, 0, moved)
        form.setFieldsValue({ prompt: updated })
    }

    return (
        <Form form={form} layout="vertical">
            <Form.Item label="Node Name" name="node" width="100%" required>
                <Select placeholder="Select a node name" />
            </Form.Item>
            <Form.Item label="Prompt" name="prompt" required width="100%">
                <Form.List name="prompt">
                    {(fields, { add, remove }) => (
                        <>
                            <Form.Item name="system">
                                <Input
                                    prefix="System :"
                                    placeholder="Enter a prompt here."
                                />
                            </Form.Item>
                            {fields.map(
                                ({ key, name, ...restField }, index) => (
                                    <>
                                        <S_FlexWrapper
                                            width="100%"
                                            alignItems="center"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'type']}
                                            >
                                                <Select
                                                    options={promptTypeOptions}
                                                    width="10rem"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                width="100%"
                                                {...restField}
                                                name={[name, 'prompt']}
                                            >
                                                <Input
                                                    placeholder="Enter a prompt here."
                                                    suffix={
                                                        fields.length > 1 && (
                                                            <S_ChangeButton
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => {
                                                                    if (
                                                                        index ===
                                                                        0
                                                                    ) {
                                                                        moveField(
                                                                            index,
                                                                            index +
                                                                                1,
                                                                        )
                                                                    } else {
                                                                        moveField(
                                                                            index,
                                                                            index -
                                                                                1,
                                                                        )
                                                                    }
                                                                }}
                                                            >
                                                                <Tooltip title="Change order">
                                                                    ⇅
                                                                </Tooltip>
                                                            </S_ChangeButton>
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    type="text"
                                                    onClick={() => remove(name)}
                                                >
                                                    <Tooltip title="Remove">
                                                        <MinusCircleOutlined />
                                                    </Tooltip>
                                                </Button>
                                            </Form.Item>
                                        </S_FlexWrapper>
                                    </>
                                ),
                            )}
                            <Form.Item width="100%">
                                <Button
                                    extendedSize
                                    onClick={() => add({ type: 'user' })}
                                    disabled={fields.length > 1}
                                >
                                    <PlusCircleOutlined />
                                    Add message
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item label="Commit message (Optional)" name="commitMessage">
                <S_Helper>
                    Provide information about the changed made in this version.
                    Helps maintain a clear history of prompt iterations.
                </S_Helper>
                <TextArea
                    height={80}
                    resize={false}
                    placeholder="Add commit message..."
                />
            </Form.Item>
        </Form>
    )
}

export default CreatePromptForm
