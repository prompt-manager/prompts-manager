import { Form, Input, Upload } from '../../../../components'
import React from 'react'
import { FormInstance } from 'antd'

interface NewDatasetsFormProps {
  form: FormInstance<any>
  file: File | null
  onSetFile: (file: File | null) => void
}

const NewDataSetsForm = ({ form, file, onSetFile }: NewDatasetsFormProps) => {
  return (
    <>
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Name"
          name="name"
          width="100%"
          rules={[{ required: true, message: 'Please input datasets name!' }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item label="Description (Optional)" name="description" width="100%">
          <Input placeholder="Description" />
        </Form.Item>
        <Form.Item
          label="CSV"
          name="csv"
          rules={[
            {
              validator: (_, value) => {
                if (!form.getFieldValue('csv') && !file) {
                  return Promise.reject(new Error('Please upload csv file!'))
                }
                return Promise.resolve()
              },
            },
          ]}
          required
        >
          <Upload
            accept=".csv"
            maxCount={1}
            beforeUpload={(file) => {
              onSetFile(file)
              form.setFieldsValue({ csv: file.name }) // form 내부에 csv 값을 넣어줌 (필수)
              return false
            }}
            onRemove={() => {
              onSetFile(null)
              form.setFieldsValue({ csv: null }) // 삭제 시 값도 제거
            }}
          />
        </Form.Item>
      </Form>
    </>
  )
}

export default NewDataSetsForm
