import { Button, Tooltip, Search, Modal, Input } from '../../components'
import { S_FlexWrapper } from '../styles/Page.style'
import DatasetsTable from './components/table/DatasetsTable'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import NewDataSetsForm from './components/form/NewDataSetsForm'
import { message } from 'antd'
import { getDatasets } from '../../api/service/datasetsService'
import { DatasetsList } from '../../types/api'

const DatasetsContent = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [openModal, setOpenModal] = useState<boolean>(false)

  const [pageNumber, setPageNumber] = useState<number>(1)

  const [datasetsList, setDatasetsList] = useState<DatasetsList[] | undefined>(undefined)

  const fetchDatasets = async () => {
    try {
      const response = await getDatasets()

      if (response.data) {
        setDatasetsList(response.data as DatasetsList[])
      }
    } catch (e) {
      console.error('[ERROR] fetchDatasets', e)
    }
  }

  const handleClickNewDatasets = () => {
    // open modal
    setOpenModal(true)
  }

  const handleCreateDatasets = () => {
    setOpenModal(false)

    // Create
    messageApi.open({
      type: 'success',
      content: 'Create Successfully.',
    })
    // messageApi.open({
    //     type: 'error',
    //     content: 'Creation failed.',
    // })
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleChangePage = (page: number) => {
    setPageNumber(page)
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
          <NewDataSetsForm />
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
          <Search placeholder="Search prompt" width="280px" />
          <DatasetsTable data={datasetsList} onChangePage={handleChangePage} />
        </S_FlexWrapper>
      </S_FlexWrapper>
    </>
  )
}

export default DatasetsContent
