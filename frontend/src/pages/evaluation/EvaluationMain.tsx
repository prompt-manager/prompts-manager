import React, { useState } from 'react'
import { Layout, Button } from '../../components'
import EvaluationForm from './components/form/EvaluationForm'
import EvaluatedResultTable from './components/table/EvaluatedResultTable'

import { LikeOutlined } from '@ant-design/icons'
import { S_FlexWrapper } from '../styles/Page.style'

const data: any[] = [
    {
        key: '1',
        name: 'Prompt1',
        versions: 1,
        datasets: 'data1',
        metric: 'metric1',
        production: {
            default: '1a',
            options: [
                { label: '임시1a', value: '1a' },
                { label: '임시2a', value: '2a' },
                { label: '임시3a', value: '3a' },
            ],
        },
    },
    {
        key: '2',
        name: 'Prompt2',
        versions: 2,
        datasets: 'data2',
        metric: 'metric2',
        production: {
            default: '1b',
            options: [
                { label: '임시1b', value: '1b' },
                { label: '임시2b', value: '2b' },
                { label: '임시3b', value: '3b' },
            ],
        },
    },
    {
        key: '3',
        name: 'Prompt3',
        versions: 3,
        datasets: 'data3',
        metric: 'metric3',
        production: {
            default: '1c',
            options: [
                { label: '임시1c', value: '1c' },
                { label: '임시2c', value: '2c' },
                { label: '임시3c', value: '3c' },
            ],
        },
    },
]

const EvaluationMain = () => {
    const [isEvaluated, setIsEvaluated] = useState<boolean>(false)
    const [evaluatedResult, setEvaluatedResult] = useState<any | undefined>(
        data,
    )

    const handleEvaluate = () => {
        // Evaluate API

        // response: success
        // setEvaluatedResult()
        setIsEvaluated(true)
    }

    return (
        <Layout
            menuKey="evaluation"
            headerTitle={
                <span>
                    <LikeOutlined /> Evaluation
                </span>
            }
        >
            <S_FlexWrapper flexDirection="column" gap={16}>
                <EvaluationForm />
                <Button type="primary" onClick={handleEvaluate}>
                    Evaluate
                </Button>
                {isEvaluated && <EvaluatedResultTable data={evaluatedResult} />}
            </S_FlexWrapper>
        </Layout>
    )
}

export default EvaluationMain
