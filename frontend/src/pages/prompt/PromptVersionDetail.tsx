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
import { PromptsResponse, PromptType } from '../../types/api'
import { DescriptionsItemType } from 'antd/es/descriptions'
import { deletePromptsNodeVersion, postPromptsProduction } from '../../api/service/apiService'

interface PromptVersionDetailProps {
  versionDetail: PromptsResponse | undefined
  defaultProduction: string | number | undefined
  visibleDeleteButton: boolean
  onChangeDefaultProduction: (version: number | string) => void
  refreshPromptsNode: (nodeName: string) => Promise<void>
  refreshPromptList: () => Promise<void>
}

const PromptVersionDetail = ({
  defaultProduction,
  versionDetail,
  visibleDeleteButton,
  onChangeDefaultProduction,
  refreshPromptsNode,
  refreshPromptList,
}: PromptVersionDetailProps) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const { id, node_name, version, content } = versionDetail as PromptsResponse
  const isDefaultProduction = defaultProduction === id

  const fetchDeletePromptsNodeVersion = async () => {
    try {
      const response = await deletePromptsNodeVersion({
        node_name,
        version,
      })

      if (response.status === 'success') {
        messageApi.open({
          type: 'success',
          content: 'Delete successful.',
        })

        refreshPromptsNode(node_name)
        refreshPromptList()
      } else {
        messageApi.open({
          type: 'error',
          content: 'Deletion failed.',
        })
      }
    } catch (e) {
      console.error('[ERROR] fetchPromptsNodeVersion', e)
    } finally {
      handleCloseDeleteModal()
    }
  }

  const fetchPostPromptsProduction = async (id: string | number) => {
    try {
      const response = await postPromptsProduction(id)

      if (response.status === 'success') {
        messageApi.open({
          type: 'success',
          content: 'It is set to production prompt.',
        })

        onChangeDefaultProduction(id)
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

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  const handleDeleteVersion = () => {
    fetchDeletePromptsNodeVersion()
  }

  const handleClickCopy = async (text: string | null | undefined) => {
    try {
      await navigator.clipboard.writeText(text as string)
      messageApi.open({
        type: 'success',
        content: 'Copied! 🎉',
      })
    } catch (err) {
      messageApi.open({
        type: 'error',
        content: 'Copy failed 😞',
      })
    }
  }

  const handleClickProduction = (id: number | string) => {
    if (id !== defaultProduction) {
      fetchPostPromptsProduction(id)
    }
  }

  const itemArr: PromptType[] = ['system', 'user', 'assistant']

  const items = itemArr.map((item: PromptType) => {
    return {
      label: item,
      span: 'filled',
      children: (
        <S_FlexWrapper alignItems="center" justifyContent="space-between">
          {content[item as PromptType]?.prompt || '-'}
          <Tooltip title="Copy">
            <Button
              type="text"
              onClick={() => handleClickCopy(content[item as PromptType]?.prompt)}
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
        <Modal open={openDeleteModal} onOk={handleDeleteVersion} onCancel={handleCloseDeleteModal}>
          <>
            <WarningOutlined /> Are you sure you want to delete ver.
            {version}?
          </>
        </Modal>
      )}
      {contextHolder}
      <S_PromptVersionDetail>
        <S_PromptVersionDetailHeader>
          <S_FlexWrapper width="100%" alignItems="center" justifyContent="space-between">
            <S_FlexWrapper alignItems="center">
              <Tag type="outline">ver.{version}</Tag>
              <Tooltip title="Production">
                <Button type="text" onClick={() => handleClickProduction(id)}>
                  {isDefaultProduction ? <ThunderboltFilled /> : <ThunderboltOutlined />}
                </Button>
              </Tooltip>
            </S_FlexWrapper>
            <Tooltip title={isDefaultProduction ? "Production can't be deleted." : 'Delete Prompt'}>
              {visibleDeleteButton && (
                <Button type="text" disabled={isDefaultProduction} onClick={handleOpenDeleteModal}>
                  <DeleteOutlined />
                </Button>
              )}
            </Tooltip>
          </S_FlexWrapper>
        </S_PromptVersionDetailHeader>
        <S_PromptVersionDetailContent>
          <Descriptions bordered items={items as DescriptionsItemType[]} />
        </S_PromptVersionDetailContent>
      </S_PromptVersionDetail>
    </>
  )
}

export default PromptVersionDetail
