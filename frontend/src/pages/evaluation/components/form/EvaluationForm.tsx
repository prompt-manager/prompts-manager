import { Form, Select } from '../../../../components'
import React from 'react'

const EvaluationForm = () => {
    return (
        <Form layout="vertical">
            <Form.Item label="Node Name" name="name" width="100%" required>
                <Select
                    placeholder="Select a node name"
                    options={[{ label: 1, value: 1 }]}
                />
            </Form.Item>
            <Form.Item
                label="Prompt Version"
                name="version"
                width="100%"
                required
            >
                <Select
                    placeholder="Select a node prompt version"
                    options={[]}
                />
            </Form.Item>
            <Form.Item label="Datasets" name="datasets" width="100%" required>
                <Select placeholder="Select a node datasets" options={[]} />
            </Form.Item>
            <Form.Item label="Metric Name" name="metric" width="100%" required>
                <Select placeholder="Select a node metric" options={[]} />
            </Form.Item>
        </Form>
    )
}

export default EvaluationForm
