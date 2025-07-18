import axiosCreate from '../../libs/axios'
import { DATASETS_ENDPOINT } from './apiService'
import { DatasetsList } from '../../types/api'
import { AxiosResponse } from 'axios'

export const getDatasets = (): Promise<AxiosResponse<DatasetsList[]>> =>
  axiosCreate.get<DatasetsList[]>(DATASETS_ENDPOINT)
