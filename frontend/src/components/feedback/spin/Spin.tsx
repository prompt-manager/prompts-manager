import { S_Spin } from './Spin.style'
import { SpinProps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

const Spin = ({...props}: SpinProps) => {
    return <S_Spin
        {...props}
        indicator={<LoadingOutlined style={{ color:"#8aaee0"}} spin />}
        size="large">
        {props.children}
    </S_Spin>
}

export default Spin
