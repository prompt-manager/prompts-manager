import { Button, Table } from '../../../../components'
import { ThunderboltFilled, ThunderboltOutlined } from '@ant-design/icons'
import React from 'react'
import { message } from 'antd'
import { postPromptsProduction } from '../../../../api/service/apiService'

interface EvaluatedResultTableProps {
  data: any
  refreshEvaluatedResult: () => Promise<void>
}

const EvaluatedResultTable = ({ data, refreshEvaluatedResult }: EvaluatedResultTableProps) => {
  const [messageApi, contextHolder] = message.useMessage()

  const fetchPostPromptsProduction = async (id: string | number) => {
    try {
      const response = await postPromptsProduction(id)

      if (response.status === 'success') {
        messageApi.open({
          type: 'success',
          content: 'It is set to production prompt.',
        })

        refreshEvaluatedResult()
      } else {
        messageApi.open({
          type: 'error',
          content: 'Production setting failed.',
        })
      }
    } catch (e) {
      console.error('[ERROR] fetchPostPromptProduction', e)
    }
  }

  const handleChangeProduction = (id: string) => {
    fetchPostPromptsProduction(id)
  }

  const columns: any[] = [
    {
      title: 'Versions',
      dataIndex: 'version',
    },
    {
      title: 'Score',
      dataIndex: 'score',
    },
    {
      title: 'Production',
      dataIndex: 'production',
      render: (_: string, record: any) => {
        return (
          <Button type="text" onClick={() => handleChangeProduction(record.prompt_id)}>
            {record.production ? <ThunderboltFilled /> : <ThunderboltOutlined />}
          </Button>
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
