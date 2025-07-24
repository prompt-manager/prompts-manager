import { S_FlexWrapper } from '../styles/Page.style'
import React, { useEffect, useState } from 'react'
import { Button, Layout, Tooltip } from '../../components'
import PromptManageTable from './components/table/PromptManageTable'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getPromptsNodesSummary } from '../../api/service/apiService'
import { PromptNodeSummary } from '../../types/api'

const EditPromptPage = () => {
  const navigate = useNavigate()

  const [pageNumber, setPageNumber] = useState<number>(1)
  const [promptList, setPromptList] = useState<PromptNodeSummary[] | undefined>(undefined)

  const fetchPromptsNodesSummary = async () => {
    try {
      const response = await getPromptsNodesSummary()

      if (response.status) {
        setPromptList(response.data!)
      }
    } catch (e) {
      console.error('[ERROR] fetchPromptsNodesSummary', e)
    }
  }

  const handleChangePage = (page: number) => {
    setPageNumber(page)
  }

  const handleClickCreate = () => {
    navigate('/prompt/create')
  }

  useEffect(() => {
    fetchPromptsNodesSummary()
  }, [pageNumber])

  return (
    <Layout menuKey="prompt/manage" headerTitle={<span>Manage Prompt</span>}>
      <S_FlexWrapper flexDirection="column" gap={16}>
        <Button type="primary" fixedSize onClick={handleClickCreate}>
          + New Prompt
        </Button>
        <PromptManageTable data={promptList} onChangePage={handleChangePage} />
      </S_FlexWrapper>
    </Layout>
  )
}

export default EditPromptPage
