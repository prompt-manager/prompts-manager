import { Table, Tooltip, Button, Tag, Modal } from '../../../../components'
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import NodeDetailDrawer from '../drawer/NodeDetailDrawer'
import { message } from 'antd'

export interface NodeData {
    key: React.Key
    name: string
    versions: number
    latestUpdate: string
}

const PromptManageTable = () => {
    const [messageApi, contextHolder] = message.useMessage()

    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [selectedRow, setSelectedRow] = useState<NodeData | undefined>(
        undefined,
    )

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
            title: 'Name',
            dataIndex: 'name',
            ellipsis: true,
            render: (text: string, record: NodeData) => (
                <Tag onClick={() => handleClickNodeName(record)}>{text}</Tag>
            ),
        },
        {
            title: 'Versions',
            width: '90px',
            dataIndex: 'versions',
        },
        {
            // TODO api: UTC -> 한국 시간으로 변환
            title: 'Latest Version Created At',
            dataIndex: 'latestUpdate',
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    {text}
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

    const data: NodeData[] = [
        {
            key: '1',
            name: 'Prompt1',
            versions: 1,
            latestUpdate: '2021-11-15',
        },
        {
            key: '2',
            name: 'Prompt2',
            versions: 2,
            latestUpdate: '2021-11-22',
        },
        {
            key: '3',
            name: 'Prompt3',
            versions: 3,
            latestUpdate:
                '2025-12-31 2025-12-31 2025-12-31 2025-12-31 2025-12-31',
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
                <Modal
                    open={openDeleteModal}
                    onOk={handleDeletePrompt}
                    onCancel={handleCloseDeleteModal}
                >
                    <WarningOutlined /> Are you sure you want to delete{' '}
                    {selectedRow?.name}?
                </Modal>
            )}
            {contextHolder}
            <Table columns={columns} dataSource={data} pagination={false} />
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
