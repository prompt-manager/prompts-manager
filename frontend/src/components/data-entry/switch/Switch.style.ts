import {Switch, SwitchProps} from 'antd'
import styled from 'styled-components'

const S_Switch = styled(Switch)<SwitchProps>`
    &.ant-switch {
        background-color: #ccc; // 비활성 상태
        transition: background-color 0.3s;
    }

    &.ant-switch:hover {
        background-color: #ccc;
        opacity: 0.7;
    }

    &.ant-switch-checked {
        background-color: var(--blue-z-03); // 활성화 상태
    }

    &.ant-switch-checked:hover {
        background-color: var(--blue-z-03) !important; 
        opacity: 0.7;
    }
`

S_Switch.displayName = "S_Switch"
export default S_Switch
