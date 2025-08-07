import { Button, Tooltip, Search, Modal, Form } from '../../components'
import { S_FlexWrapper } from '../styles/Page.style'
import DatasetsTable from './components/table/DatasetsTable'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import NewDataSetsForm from './components/form/NewDataSetsForm'
import { message } from 'antd'
import { getDatasets, getDatasetsSearch, postDatasets } from '../../api/service/apiService'
import { CreateDatasets, DatasetsListItem } from '../../types/api'

const DatasetsContent = () => {
  const [form] = Form.useForm()

  const [messageApi, contextHolder] = message.useMessage()
  const [openModal, setOpenModal] = useState<boolean>(false)

  const [pageNumber, setPageNumber] = useState<number>(1)
  const [searchText, setSearchText] = useState<string>('')

  const [datasetsList, setDatasetsList] = useState<DatasetsListItem[] | undefined>(undefined)

  const [file, setFile] = useState<File | null>(null)

  const fetchDatasets = async () => {
    try {
      const response = await getDatasets()

      if (response.status) {
        setDatasetsList(response.data?.items as DatasetsListItem[])
      }
    } catch (e) {
      console.error('[ERROR] fetchDatasets', e)
    }
  }

  const fetchDatasetsSearch = async (keyword: string) => {
    try {
      const response = await getDatasetsSearch(keyword)

      if (response.status) {
        setDatasetsList(response.data as DatasetsListItem[])
      }
    } catch (e) {
      console.error('[ERROR] fetchDatasetsSearch', e)
    }
  }

  const fetchCreateDatasets = async () => {
    try {
      const values = await form.validateFields()

      const payload = {
        name: values.name,
        description: values.description || '',
        file,
      }

      const response = await postDatasets(payload as CreateDatasets)

      if (response.status === 'success') {
        if (response.message) {
          messageApi.open({
            type: 'error',
            content: response.message,
          })
        } else {
          messageApi.open({
            type: 'success',
            content: 'Create Successfully.',
          })

          handleCloseModal()
          fetchDatasets()
        }
      } else {
        messageApi.open({
          type: 'error',
          content: 'Creation failed.',
        })
      }
    } catch (e) {
      console.error('[ERROR] handleUpload csv', e)
    }
  }

  const handleChangeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleClickSearch = () => {
    if (!searchText.trim()) {
      fetchDatasets()
    } else {
      fetchDatasetsSearch(searchText)
    }
  }

  const handleClickNewDatasets = () => {
    setOpenModal(true)
  }

  const handleCreateDatasets = () => {
    fetchCreateDatasets()
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    form.resetFields()
    setFile(null)
  }

  const handleChangePage = (page: number) => {
    setPageNumber(page)
  }

  const handleSetFile = (value: File | null) => {
    setFile(value)
  }

  useEffect(() => {
    fetchDatasets()
  }, [pageNumber])

  return (
    <>
      {contextHolder}
      {openModal && (
        <Modal
          title="Create new datasets"
          open={openModal}
          okText="Create"
          onOk={handleCreateDatasets}
          onCancel={handleCloseModal}
        >
          <NewDataSetsForm form={form} file={file} onSetFile={handleSetFile} />
        </Modal>
      )}
      <S_FlexWrapper flexDirection="column" gap={8}>
        <S_FlexWrapper width="100%" justifyContent="flex-end">
          <Tooltip title="New Datasets">
            <Button type="text" onClick={handleClickNewDatasets}>
              <PlusOutlined />
            </Button>
          </Tooltip>
        </S_FlexWrapper>
        <S_FlexWrapper flexDirection="column">
          <Search
            placeholder="Search prompt"
            width="280px"
            onChange={handleChangeSearchText}
            onSearch={handleClickSearch}
          />
          <DatasetsTable
            data={datasetsList}
            onChangePage={handleChangePage}
            refreshDatasets={fetchDatasets}
          />
        </S_FlexWrapper>
      </S_FlexWrapper>
    </>
  )
}

export default DatasetsContent
