import { Drawer } from '../../../../components'
import React, { useEffect, useState } from 'react'
import { NodeData } from '../table/PromptManageTable'
import { S_FlexWrapper } from '../../../styles/Page.style'
import PromptVersionDetail from '../../PromptVersionDetail'
import PromptVersionList from '../../PromptVersionList'
import { message } from 'antd'

interface NodeDetailDrawerProps {
    openDrawer: boolean
    selectedRow: NodeData | undefined
    onClose: () => void
}

const versionList = [
    {
        version: '1',
        name: '임시1',
        date: '2025.6.14. 오전 11:45:35',
        isProduction: false,
        prompt: {
            system: 'AI 전문가1 System',
            user: 'AI 전문가1 User',
            assistant: 'AI 전문가1 Assistant',
        },
    },
    {
        version: '2',
        name: '임시2',
        date: '2025.6.15. 오전 11:45:35',
        isProduction: true,
        prompt: {
            system: 'AI 전문가2 System',
            user: 'AI 전문가2 User',
            assistant: 'AI 전문가2 Assistant',
        },
    },
    {
        version: '3',
        name: '임시3',
        date: '2025.6.16. 오전 11:45:35',
        isProduction: false,
        prompt: {
            system: 'AI 전문가3 System',
            user: 'AI 전문가3 User',
            assistant: 'AI 전문가3 Assistant',
        },
    },
]

const NodeDetailDrawer = ({
    openDrawer,
    selectedRow,
    onClose,
}: NodeDetailDrawerProps) => {
    const [versionDetail, setVersionDetail] = useState<any>(undefined)
    const [defaultProduction, setDefaultProduction] = useState<any>(undefined)

    const handleSetVersionDetail = (data: any) => {
        setVersionDetail(data)
    }

    const handleChangeDefaultProduction = (version: string) => {
        setDefaultProduction(version)
    }

    useEffect(() => {
        setVersionDetail(versionList[0])
        const productionVersion = versionList.find((item) => item.isProduction)
        setDefaultProduction(productionVersion?.version)
    }, [openDrawer])

    return (
        <Drawer
            open={openDrawer}
            title={selectedRow?.name}
            size="large"
            onClose={onClose}
        >
            <S_FlexWrapper flexDirection="row" height="100%">
                <PromptVersionList
                    defaultProduction={defaultProduction}
                    versionList={versionList}
                    onSetVersionDetail={handleSetVersionDetail}
                />
                <PromptVersionDetail
                    defaultProduction={defaultProduction}
                    versionDetail={versionDetail}
                    onChangeDefaultProduction={handleChangeDefaultProduction}
                />
            </S_FlexWrapper>
        </Drawer>
    )
}

export default NodeDetailDrawer
