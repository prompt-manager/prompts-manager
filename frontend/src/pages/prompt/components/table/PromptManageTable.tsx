import { Table, Tooltip, Button, Tag, Modal } from '../../../../components'
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import NodeDetailDrawer from '../drawer/NodeDetailDrawer'
import { message } from 'antd'
import { PromptNodeSummary } from '../../../../types/api'
import { convertDateTime } from '../../../../utils/convertDateTime'

export interface NodeData {
  key: React.Key
  name: string
  versions: number
  latestUpdate: string
}

interface PromptManageTableProps {
  data: PromptNodeSummary[] | undefined
  onChangePage: (page: number) => void
}

const PromptManageTable = ({ data, onChangePage }: PromptManageTableProps) => {
  const [messageApi, contextHolder] = message.useMessage()

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<NodeData | undefined>(undefined)

  const handleClickNodeName = (record: NodeData) => {
    setSelectedRow(record)
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setSelectedRow(undefined)
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  const handleDeletePrompt = () => {
    setOpenDeleteModal(false)

    // Delete
    // selectedRow.key 에 해당하는 row 삭제

    messageApi.open({
      type: 'success',
      content: 'Delete Successfully.',
    })
    // messageApi.open({
    //     type: 'error',
    //     content: 'Deletion failed.',
    // })
  }

  const columns: any[] = [
    {
      title: 'Node name',
      dataIndex: 'node_name',
      ellipsis: true,
      render: (text: string, record: NodeData) => (
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
      // TODO api: UTC -> 한국 시간으로 변환
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
      render: (_: string) => (
        <Button type="text" onClick={handleOpenDeleteModal}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ]

  useEffect(() => {
    if (selectedRow) {
      setOpenDrawer(true)
    }
  }, [selectedRow])

  return (
    <>
      {openDeleteModal && (
        <Modal open={openDeleteModal} onOk={handleDeletePrompt} onCancel={handleCloseDeleteModal}>
          <WarningOutlined /> Are you sure you want to delete {selectedRow?.name}?
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
