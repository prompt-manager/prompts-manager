import { Drawer } from '../../../../components'
import React, { useEffect, useState } from 'react'
import { NodeData } from '../table/PromptManageTable'
import { S_FlexWrapper } from '../../../styles/Page.style'
import PromptVersionDetail from '../../PromptVersionDetail'
import PromptVersionList from '../../PromptVersionList'
import { message } from 'antd'
import { PromptNodeSummary, PromptsResponse } from '../../../../types/api'
import { convertDateTime } from '../../../../utils/convertDateTime'

interface NodeDetailDrawerProps {
  openDrawer: boolean
  title: string
  nodeDetail: PromptsResponse[] | undefined
  onClose: () => void
  refreshPromptsNode: (nodeName: string) => Promise<void>
  refreshPromptList: () => Promise<void>
}

const NodeDetailDrawer = ({
  openDrawer,
  nodeDetail,
  title,
  onClose,
  refreshPromptsNode,
  refreshPromptList,
}: NodeDetailDrawerProps) => {
  const [versionList, setVersionList] = useState<any>([])
  const [versionDetail, setVersionDetail] = useState<PromptsResponse | undefined>(undefined)
  const [defaultProduction, setDefaultProduction] = useState<string | number | undefined>(undefined)

  const handleSetVersionDetail = (data: PromptsResponse | undefined) => {
    setVersionDetail(data)
  }

  const handleChangeDefaultProduction = (id: number | string) => {
    setDefaultProduction(id)
  }

  useEffect(() => {
    if (nodeDetail) {
      setVersionDetail(nodeDetail[0])

      const versionListData = nodeDetail.map((detail) => ({
        id: detail.id,
        node_name: detail.node_name,
        version: detail.version,
        date: convertDateTime(Number(detail.updated_at)),
        isProduction: detail.production,
        content: detail.content,
      }))
      setVersionList(versionListData)

      const productionVersion = nodeDetail.find((item) => item.production)
      setDefaultProduction(productionVersion?.id)
    }
  }, [nodeDetail])

  return (
    <Drawer open={openDrawer} title={title} sizeType="md" onClose={onClose}>
      <S_FlexWrapper flexDirection="row" height="100%">
        <PromptVersionList
          defaultProduction={defaultProduction}
          versionList={versionList}
          onSetVersionDetail={handleSetVersionDetail}
        />
        <PromptVersionDetail
          defaultProduction={defaultProduction}
          versionDetail={versionDetail}
          visibleDeleteButton={(nodeDetail?.length ?? 0) > 1}
          onChangeDefaultProduction={handleChangeDefaultProduction}
          refreshPromptsNode={refreshPromptsNode}
          refreshPromptList={refreshPromptList}
        />
      </S_FlexWrapper>
    </Drawer>
  )
}

export default NodeDetailDrawer
