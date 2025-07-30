import { Form, Select } from '../../../../components'
import React from 'react'
import { SelectOption } from '../../../../types/common'
import { FormInstance } from 'antd'
import { EvaluationParams } from '../../../../types/api'

interface EvaluationFormProps {
  form: FormInstance<EvaluationParams>
  options: {
    node: SelectOption[]
    datasets: SelectOption[]
    metric: SelectOption[]
  }
}

const EvaluationForm = ({ form, options }: EvaluationFormProps) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Node Name"
        name="node_name"
        width="100%"
        rules={[{ required: true, message: 'Please select node name!' }]}
      >
        <Select placeholder="Select a node name" options={options.node} />
      </Form.Item>
      <Form.Item
        label="Datasets"
        name="dataset_id"
        width="100%"
        rules={[{ required: true, message: 'Please select dataset id!' }]}
      >
        <Select placeholder="Select a node datasets" options={options.datasets} />
      </Form.Item>
      <Form.Item
        label="Metric Name"
        name="metric_name"
        width="100%"
        rules={[{ required: true, message: 'Please select metric name!' }]}
      >
        <Select placeholder="Select a node metric" options={options.metric} />
      </Form.Item>
    </Form>
  )
}

export default EvaluationForm
