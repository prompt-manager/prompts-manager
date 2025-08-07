import { S_Divider } from './Divider.style'
import { DividerProps } from 'antd'

export const Divider = ({...props}: DividerProps) => {
  return (
    <S_Divider {...props} />
  )
}

export default Divider
