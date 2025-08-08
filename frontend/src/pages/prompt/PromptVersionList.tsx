import {
  S_FlexWrapper,
  S_Helper,
  S_ProductionState,
  S_PromptVersion,
  S_PromptVersionList,
} from '../styles/Page.style'
import { Button, Timeline, Tag } from '../../components'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PromptsContent, PromptsResponse } from '../../types/api'

const PromptList = ({
  id,
  node_name,
  version,
  date,
  content,
  isSelected = false,
  isProduction = false,
  onClickList,
}: {
  id: string | number
  node_name: string
  version: string
  date: string
  content: PromptsContent
  isSelected?: boolean
  isProduction?: boolean
  onClickList: (data: any) => void
}) => {
  const handleClick = () => {
    const detailData = {
      id,
      node_name,
      version,
      content,
    }

    onClickList(detailData)
  }

  return (
    <S_PromptVersion onClick={handleClick} isSelected={isSelected}>
      <S_FlexWrapper gap={8} justifyContent="space-between">
        <Tag type="outline" color="var(--blue-12)">
          ver.{version}
        </Tag>
        {isProduction && <S_ProductionState>⚡️ production</S_ProductionState>}
      </S_FlexWrapper>
      <S_Helper>{date}</S_Helper>
    </S_PromptVersion>
  )
}

interface PromptListContentProps {
  defaultProduction: string | number | undefined
  versionList: any
  onSetVersionDetail?: (data: PromptsResponse | undefined) => void
}

const PromptVersionList = ({
  defaultProduction,
  versionList,
  onSetVersionDetail,
}: PromptListContentProps) => {
  const navigate = useNavigate()

  const [selectedVersion, setSelectedVersion] = useState<number | undefined>(undefined)

  const handleClickList = (values: PromptsResponse | undefined) => {
    if (onSetVersionDetail) {
      onSetVersionDetail(values)

      setSelectedVersion(values?.version)
    }
  }

  const handleClickCreate = () => {
    navigate('/prompt/create')
  }

  const timeLineItems = versionList.map((list: any) => {
    return {
      children: (
        <PromptList
          id={list.id}
          node_name={list.node_name}
          version={list.version}
          date={list.date}
          content={list.content}
          isSelected={selectedVersion === list.version}
          isProduction={defaultProduction === list.id}
          onClickList={handleClickList}
        />
      ),
    }
  })

  useEffect(() => {
    if (versionList) {
      setSelectedVersion(versionList[0].version)
    }
  }, [versionList])

  return (
    <>
      <S_PromptVersionList>
        <Button type="primary" fixedSize onClick={handleClickCreate}>
          + New Prompt
        </Button>
        <Timeline items={timeLineItems} />
      </S_PromptVersionList>
    </>
  )
}

export default PromptVersionList
