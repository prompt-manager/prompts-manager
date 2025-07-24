import { Table, Tooltip, Button, Tag, Modal } from '../../../../components'
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import NodeDetailDrawer from '../drawer/NodeDetailDrawer'
import { message } from 'antd'
import { PromptNodeSummary } from '../../../../types/api'
import { convertDateTime } from '../../../../utils/convertDateTime'
import { deletePromptsNodeVersion } from '../../../../api/service/apiService'

export interface NodeData {
  key: React.Key
  node_name: string
  prompt_count: number
  latestUpdate: string
}

interface PromptManageTableProps {
  data: PromptNodeSummary[] | undefined
  onChangePage: (page: number) => void
  refreshPromptList: () => Promise<void>
}

const PromptManageTable = ({ data, onChangePage, refreshPromptList }: PromptManageTableProps) => {
  const [messageApi, contextHolder] = message.useMessage()

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<PromptNodeSummary | undefined>(undefined)

  const handleClickNodeName = (record: PromptNodeSummary) => {
    setSelectedRow(record)
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setSelectedRow(undefined)
  }

  const handleClickDelete = (record: PromptNodeSummary) => {
    setSelectedRow(record)
    setOpenDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  const handleDeletePrompt = async () => {
    try {
      const response = await deletePromptsNodeVersion({
        node_name: selectedRow?.node_name || '',
        version: selectedRow?.prompt_count || 0,
      })

      if (response.status) {
        setOpenDeleteModal(false)

        messageApi.open({
          type: 'success',
          content: 'Delete Successfully.',
        })

        refreshPromptList()
      } else {
        messageApi.open({
          type: 'error',
          content: 'Deletion failed.',
        })
      }
    } catch (e) {
      console.error('[ERROR] Delete prompt', e)
    }
  }

  const columns: any[] = [
    {
      title: 'Node name',
      dataIndex: 'node_name',
      ellipsis: true,
      render: (text: string, record: PromptNodeSummary) => (
        <Tag fullText={text} width="10rem" onClick={() => handleClickNodeName(record)}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Prompt count',
      dataIndex: 'prompt_count',
    },
    {
      title: 'Latest Version Created At',
      dataIndex: 'latest_created_at',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          {convertDateTime(Number(text))}
        </Tooltip>
      ),
    },
    {
      title: '',
      dataIndex: 'delete',
      width: '100px',
      render: (_: string, record: PromptNodeSummary) => (
        <Button type="text" onClick={() => handleClickDelete(record)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ]

  return (
    <>
      {openDeleteModal && (
        <Modal open={openDeleteModal} onOk={handleDeletePrompt} onCancel={handleCloseDeleteModal}>
          <WarningOutlined /> Are you sure you want to delete {selectedRow?.node_name}?
        </Modal>
      )}
      {contextHolder}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        onChange={(pagination) => {
          onChangePage(pagination.current as number)
        }}
      />
      {openDrawer && (
        <NodeDetailDrawer
          openDrawer={openDrawer}
          selectedRow={selectedRow}
          onClose={handleCloseDrawer}
        />
      )}
    </>
  )
}

export default PromptManageTable
