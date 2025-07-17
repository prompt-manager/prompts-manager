import { Form, Input } from '../../../../components'
import React from 'react'

const NewDataSetsForm = () => {
    return (
        <>
            <Form layout="vertical">
                <Form.Item
                    label="Name"
                    name="datasetsName"
                    width="100%"
                    required
                >
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                    label="Description (Optional)"
                    name="description"
                    width="100%"
                >
                    <Input placeholder="Description" />
                </Form.Item>
            </Form>
        </>
    )
}

export default NewDataSetsForm
