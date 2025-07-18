import { Button, Table, Tag, Tooltip, Input, Modal } from '../../../../components'
import {
  DeleteOutlined,
  FormOutlined,
  CheckOutlined,
  RollbackOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'
import { S_FlexWrapper } from '../../../styles/Page.style'
import { message } from 'antd'
import { DatasetsList } from '../../../../types/api'

interface DatasetsTableProps {
  data: DatasetsList[] | undefined
  onChangePage: (page: number) => void
}

const DatasetsTable = ({ data, onChangePage }: DatasetsTableProps) => {
  const [messageApi, contextHolder] = message.useMessage()

  const [selectedRow, setSelectedRow] = useState<{
    key: string
    name: string
  } | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const handleClickEdit = () => {
    setSelectedRow(null)
    // Edit

    messageApi.open({
      type: 'success',
      content: 'Edit Successfully.',
    })
    // messageApi.open({
    //     type: 'error',
    //     content: 'Edit failed.',
    // })
  }

  const handleClickCancelEdit = () => {
    setSelectedRow(null)
  }

  const handleClickDelete = () => {
    setOpenDeleteModal(false)
    // Delete
    // selectedRow.key 에 해당하는 row 삭제

    messageApi.open({
      type: 'success',
      content: 'Delete successful.',
    })
    // messageApi.open({
    //     type: 'error',
    //     content: 'Deletion failed.',
    // })
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      ellipsis: true,
      render: (text: string, record: any) => {
        const isEditing = record.key === selectedRow?.key
        return isEditing ? (
          <S_FlexWrapper>
            <Input defaultValue={text} width="120px" />
            <Tooltip title="apply">
              <Button type="text" onClick={handleClickEdit}>
                <CheckOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="cancel">
              <Button type="text" onClick={handleClickCancelEdit}>
                <RollbackOutlined />
              </Button>
            </Tooltip>
          </S_FlexWrapper>
        ) : (
          <Tag>{text}</Tag>
        )
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Items',
      dataIndex: 'content',
    },
    {
      // TODO api: UTC -> 한국 시간으로 변환
      title: 'Created',
      dataIndex: 'created_at',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          {text}
        </Tooltip>
      ),
    },
    {
      title: '',
      dataIndex: 'edit',
      width: '100px',
      render: (_: string, record: any) => (
        <Button type="text" onClick={() => setSelectedRow(record)}>
          <Tooltip title="edit">
            <FormOutlined />
          </Tooltip>
        </Button>
      ),
    },
    {
      title: '',
      dataIndex: 'delete',
      width: '100px',
      render: () => (
        <Button type="text" onClick={handleOpenDeleteModal}>
          <Tooltip title="delete">
            <DeleteOutlined />
          </Tooltip>
        </Button>
      ),
    },
  ]

  // let data = []
  //
  // for (let i = 0; i < 32; i++) {
  //     data.push({
  //         key: i,
  //         name: `Prompt${i + 1}`,
  //         description: `임시${i + 1}`,
  //         items: 100 + i,
  //         created: '2024-01-01',
  //     })
  // }

  return (
    <>
      {contextHolder}
      {openDeleteModal && (
        <Modal open={openDeleteModal} onOk={handleClickDelete} onCancel={handleCloseDeleteModal}>
          <WarningOutlined /> Are you sure you want to delete {selectedRow?.name}?
        </Modal>
      )}
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
    </>
  )
}

export default DatasetsTable
