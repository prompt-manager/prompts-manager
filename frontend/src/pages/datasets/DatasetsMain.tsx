import React from 'react'
import Layout from '../../components/layout/layout/Layout'
import { DatabaseOutlined } from '@ant-design/icons'
import DatasetsContent from './DatasetsContent'

const DatasetsMain = () => {
    return (
        <Layout
            menuKey="datasets"
            headerTitle={
                <span>
                    <DatabaseOutlined /> Datasets
                </span>
            }
        >
            <DatasetsContent />
        </Layout>
    )
}

export default DatasetsMain
