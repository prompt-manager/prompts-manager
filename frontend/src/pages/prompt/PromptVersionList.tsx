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

const PromptList = ({
    version,
    name,
    date,
    prompt,
    isSelected = false,
    isProduction = false,
    onClickList,
}: {
    version: string
    name: string
    date: string
    prompt: {
        system: string
        user: string
        assistant: string
    }
    isSelected?: boolean
    isProduction?: boolean
    onClickList: (data: any) => void
}) => {
    const handleClick = () => {
        const detailData = {
            name,
            version,
            prompt,
        }

        onClickList(detailData)
    }

    return (
        <S_PromptVersion onClick={handleClick} isSelected={isSelected}>
            <S_FlexWrapper gap={8} justifyContent="space-between">
                <Tag type="outline">ver.{version}</Tag>
                {isProduction && (
                    <S_ProductionState>⚡️ production</S_ProductionState>
                )}
            </S_FlexWrapper>
            <S_FlexWrapper flexDirection="column">
                {name}
                <S_Helper>{date}</S_Helper>
            </S_FlexWrapper>
        </S_PromptVersion>
    )
}

interface PromptListContentProps {
    defaultProduction: string
    versionList: any
    onSetVersionDetail?: (data: any) => void
}

const PromptVersionList = ({
    defaultProduction,
    versionList,
    onSetVersionDetail,
}: PromptListContentProps) => {
    const navigate = useNavigate()

    const [selectedVersion, setSelectedVersion] = useState<string | undefined>(
        undefined,
    )

    const handleClickList = (values: {
        name: string
        version: string
        prompt: {
            system: string
            user: string
            assistant: string
        }
    }) => {
        if (onSetVersionDetail) {
            onSetVersionDetail(values)

            setSelectedVersion(values.version)
        }
    }

    const handleClickCreate = () => {
        navigate('/prompt/create')
    }

    const timeLineItems = versionList.map((list: any) => {
        return {
            children: (
                <PromptList
                    version={list.version}
                    name={list.name}
                    date={list.date}
                    prompt={list.prompt}
                    isSelected={selectedVersion === list.version}
                    isProduction={defaultProduction === list.version}
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
