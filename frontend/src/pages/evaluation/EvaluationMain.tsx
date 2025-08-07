import React, { useEffect, useState } from 'react'
import { Layout, Button, Form, Spin } from '../../components'
import EvaluationForm from './components/form/EvaluationForm'
import EvaluatedResultTable from './components/table/EvaluatedResultTable'

import { LikeOutlined } from '@ant-design/icons'
import { S_FlexWrapper } from '../styles/Page.style'
import {
  getDatasetsList,
  getEvaluationsMetrics,
  getEvaluationsResultsTable,
  getPromptsNodes,
} from '../../api/service/apiService'
import { SelectOption } from '../../types/common'
import { EvaluationParams, EvaluationResults, PromptsResponse } from '../../types/api'

const EvaluationMain = () => {
  const [form] = Form.useForm<EvaluationParams>()

  const [isEvaluated, setIsEvaluated] = useState<boolean>(false)
  const [evaluatedResult, setEvaluatedResult] = useState<EvaluationResults[] | undefined>(undefined)

  const [nodeOptions, setNodeOptions] = useState<SelectOption[]>([])
  const [datasetsOptions, setDatasetsOptions] = useState<SelectOption[]>([])
  const [metricOptions, setMetricOptions] = useState<SelectOption[]>([])

  const [evaluationLoading, setEvaluationLoading] = useState<boolean>(false)

  const fetchPromptsNodes = async () => {
    const response = await getPromptsNodes()

    if (response.status === 'success') {
      const options = response.data?.map((res) => ({
        label: res.node_name,
        value: res.node_name,
      }))

      setNodeOptions(options!)
    }
  }

  const fetchDatasetsList = async () => {
    try {
      const response = await getDatasetsList()

      if (response.status === 'success') {
        const options = response.data?.map((res) => ({
          label: res.name,
          value: res.id,
        }))

        setDatasetsOptions(options!)
      }
    } catch (e) {
      console.error('[ERROR] fetchDatasetsList', e)
    }
  }

  const fetchEvaluationsMetrics = async () => {
    try {
      const response = await getEvaluationsMetrics()

      if (response.status === 'success') {
        const options = response.data?.map((res) => ({
          label: res.name,
          value: res.key,
        }))

        setMetricOptions(options!)
      }
    } catch (e) {
      console.error('[ERROR] fetchEvaluationsMetrics', e)
    }
  }

  const fetchEvaluatedResult = async () => {
    try {
      setEvaluationLoading(true)

      const { node_name, dataset_id, metric_name } = await form.validateFields()

      const parameter = { node_name, dataset_id, metric_name }

      const response = await getEvaluationsResultsTable(parameter)

      if (response.status === 'success') {
        const data = response.data?.map((res) => ({
          version: res.version,
          prompt_id: res.prompt_id,
          score: res.score,
          production: res.production,
        }))

        setEvaluatedResult(data!)
      }
    } catch (e) {
      console.error('[ERROR] fetchEvaluatedResult', e)
    } finally {
      setEvaluationLoading(false)
    }
  }

  const handleEvaluate = () => {
    fetchEvaluatedResult()
  }

  useEffect(() => {
    fetchPromptsNodes()
    fetchDatasetsList()
    fetchEvaluationsMetrics()
  }, [])

  useEffect(() => {
    if (evaluatedResult) {
      setIsEvaluated(true)
    }
  }, [evaluatedResult])

  return (
    <Layout
      menuKey="evaluation"
      headerTitle={
        <span>
          <LikeOutlined /> Evaluation
        </span>
      }
    >
      <Spin spinning={evaluationLoading}>
        <S_FlexWrapper flexDirection="column" gap={16}>
          <EvaluationForm
            form={form}
            options={{
              node: nodeOptions,
              datasets: datasetsOptions,
              metric: metricOptions,
            }}
          />
          <Button type="primary" extendedSize onClick={handleEvaluate}>
            Evaluate
          </Button>
          {isEvaluated && (
            <EvaluatedResultTable
              data={evaluatedResult}
              refreshEvaluatedResult={fetchEvaluatedResult}
            />
          )}
        </S_FlexWrapper>
      </Spin>
    </Layout>
  )
}

export default EvaluationMain
