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
import { DatasetsListItem } from '../../../../types/api'
import { convertDateTime } from '../../../../utils/convertDateTime'
import { putDatasets } from '../../../../api/service/apiService'

interface DatasetsTableProps {
  data: DatasetsListItem[] | undefined
  onChangePage: (page: number) => void
  refreshDatasets: () => Promise<void>
}

const DatasetsTable = ({ data, onChangePage, refreshDatasets }: DatasetsTableProps) => {
  const [messageApi, contextHolder] = message.useMessage()

  const [selectedRow, setSelectedRow] = useState<{
    id: string
    name: string
  } | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const fetchEditDatasets = async (params: DatasetsListItem) => {
    try {
      const response = await putDatasets(params)

      if (response.status) {
        messageApi.open({
          type: 'success',
          content: 'Edit Successfully.',
        })

        refreshDatasets()
      } else {
        messageApi.open({
          type: 'error',
          content: 'Edit failed.',
        })
      }
    } catch (e) {
      console.error('[ERROR] fetchEditDatasets', e)
    } finally {
      setSelectedRow(null)
    }
  }

  const handleEdit = (record: DatasetsListItem) => {
    fetchEditDatasets(record)
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
      title: 'Node name',
      dataIndex: 'name',
      ellipsis: true,
      render: (text: string, record: any) => {
        const isEditing = record.id === selectedRow?.id

        return isEditing ? (
          <S_FlexWrapper alignItems="center">
            <Input defaultValue={text} width="160px" />
            <Button type="text" onClick={() => handleEdit(record)}>
              <Tooltip title="apply">
                <CheckOutlined />
              </Tooltip>
            </Button>
          </S_FlexWrapper>
        ) : (
          <S_FlexWrapper alignItems="center">
            <Tag>{text}</Tag>
          </S_FlexWrapper>
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
      title: 'Created',
      dataIndex: 'created_at',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          {convertDateTime(Number(text))}
        </Tooltip>
      ),
    },
    {
      title: '',
      dataIndex: 'edit',
      width: '100px',
      render: (_: string, record: any) => {
        const isEditing = record.id === selectedRow?.id

        return (
          <>
            {isEditing ? (
              <Button type="text" onClick={handleClickCancelEdit}>
                <Tooltip title="cancel">
                  <RollbackOutlined />
                </Tooltip>
              </Button>
            ) : (
              <Button type="text" onClick={() => setSelectedRow(record)}>
                <Tooltip title="edit">
                  <FormOutlined />
                </Tooltip>
              </Button>
            )}
          </>
        )
      },
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
