import React, { useState } from 'react'
import {
    S_FlexWrapper,
    S_PromptVersionDetail,
    S_PromptVersionDetailContent,
    S_PromptVersionDetailHeader,
} from '../styles/Page.style'
import {
    DeleteOutlined,
    CopyOutlined,
    ThunderboltOutlined,
    ThunderboltFilled,
    WarningOutlined,
} from '@ant-design/icons'
import { Tag, Descriptions, Button, Tooltip, Modal } from '../../components'
import { message } from 'antd'

interface PromptVersionDetailProps {
    versionDetail: any
    defaultProduction: string
    onChangeDefaultProduction: (version: string) => void
}

const PromptVersionDetail = ({
    defaultProduction,
    versionDetail,
    onChangeDefaultProduction,
}: PromptVersionDetailProps) => {
    const [messageApi, contextHolder] = message.useMessage()
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    const { version, name, prompt } = versionDetail

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true)
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false)
    }

    const handleDeleteVersion = () => {
        handleCloseDeleteModal()

        // version 삭제 -> 왼쪽 타임라인에서도 제거 되어야 함
        messageApi.open({
            type: 'success',
            content: 'Delete successful.',
        })
        // messageApi.open({
        //     type: 'error',
        //     content: 'Deletion failed.',
        // })
    }

    const handleClickCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            messageApi.open({
                type: 'success',
                content: 'Copied! 🎉',
            })
        } catch (err) {
            messageApi.open({
                type: 'success',
                content: 'Copy failed 😞',
            })
        }
    }

    const handleClickProduction = (ver: string) => {
        onChangeDefaultProduction(ver)

        if (ver !== defaultProduction) {
            messageApi.open({
                type: 'success',
                content: 'It is set to production prompt.',
            })
        }
    }

    const itemArr = ['System', 'User', 'Assistant']

    const items: any = itemArr.map((item) => {
        return {
            label: item,
            span: 'filled',
            children: (
                <S_FlexWrapper
                    alignItems="center"
                    justifyContent="space-between"
                >
                    {prompt[item?.toLowerCase()]}
                    <Tooltip title="Copy">
                        <Button
                            type="text"
                            onClick={() =>
                                handleClickCopy(prompt[item?.toLowerCase()])
                            }
                        >
                            <CopyOutlined />
                        </Button>
                    </Tooltip>
                </S_FlexWrapper>
            ),
        }
    })

    return (
        <>
            {openDeleteModal && (
                <Modal
                    open={openDeleteModal}
                    onOk={handleDeleteVersion}
                    onCancel={handleCloseDeleteModal}
                >
                    <WarningOutlined /> Are you sure you want to delete ver.
                    {version} {name} ?
                </Modal>
            )}
            {contextHolder}
            <S_PromptVersionDetail>
                <S_PromptVersionDetailHeader>
                    <S_FlexWrapper
                        width="100%"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <S_FlexWrapper alignItems="center">
                            <Tag type="outline">ver.{version}</Tag>
                            {name}
                            <Tooltip title="Production">
                                <Button
                                    type="text"
                                    onClick={() =>
                                        handleClickProduction(version)
                                    }
                                >
                                    {defaultProduction === version ? (
                                        <ThunderboltFilled />
                                    ) : (
                                        <ThunderboltOutlined />
                                    )}
                                </Button>
                            </Tooltip>
                        </S_FlexWrapper>
                        <Tooltip title="Delete Prompt">
                            <Button type="text" onClick={handleOpenDeleteModal}>
                                <DeleteOutlined />
                            </Button>
                        </Tooltip>
                    </S_FlexWrapper>
                </S_PromptVersionDetailHeader>
                <S_PromptVersionDetailContent>
                    <Descriptions bordered items={items} />
                </S_PromptVersionDetailContent>
            </S_PromptVersionDetail>
        </>
    )
}

export default PromptVersionDetail
