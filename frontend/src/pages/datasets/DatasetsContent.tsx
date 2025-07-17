import { Button, Tooltip, Search, Modal, Input } from '../../components'
import { S_FlexWrapper } from '../styles/Page.style'
import DatasetsTable from './components/table/DatasetsTable'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import NewDataSetsForm from './components/form/NewDataSetsForm'
import { message } from 'antd'

const DatasetsContent = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const [openModal, setOpenModal] = useState<boolean>(false)

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
                    <DatasetsTable />
                </S_FlexWrapper>
            </S_FlexWrapper>
        </>
    )
}

export default DatasetsContent
