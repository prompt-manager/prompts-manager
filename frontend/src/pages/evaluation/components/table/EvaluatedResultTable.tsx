import { NodeData } from '../../../prompt/components/table/PromptManageTable'
import { Button, Tag, Tooltip, Table, Select } from '../../../../components'
import { DeleteOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { message } from 'antd'

interface EvaluatedResultTableProps {
    data: any
}

const EvaluatedResultTable = ({ data }: EvaluatedResultTableProps) => {
    const [messageApi, contextHolder] = message.useMessage()

    const [selectedRow, setSelectedRow] = useState<any>(undefined)

    const handleChangeProduction = () => {
        messageApi.open({
            type: 'success',
            content: 'Change Successfully.',
        })
        // messageApi.open({
        //     type: 'error',
        //     content: 'Change failed.',
        // })
    }

    const columns: any[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            ellipsis: true,
            render: (text: string) => <Tag>{text}</Tag>,
        },
        {
            title: 'Versions',
            width: '90px',
            dataIndex: 'versions',
        },
        {
            title: 'Datasets',
            dataIndex: 'datasets',
        },
        {
            title: 'Metric',
            width: '120px',
            dataIndex: 'metric',
        },
        {
            title: 'Production',
            dataIndex: 'production',
            render: (_: string, record: any) => {
                setSelectedRow(record)

                return (
                    <Select
                        width="120px"
                        defaultValue={record.production.default}
                        options={record.production.options}
                        onChange={handleChangeProduction}
                    />
                )
            },
        },
    ]

    return (
        <>
            {contextHolder}
            <Table columns={columns} dataSource={data} pagination={false} />
        </>
    )
}

export default EvaluatedResultTable
