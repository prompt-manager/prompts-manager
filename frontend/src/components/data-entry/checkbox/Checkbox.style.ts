import { Checkbox } from 'antd';
import styled from 'styled-components'
import {CheckboxProps} from "antd";

const S_Checkbox = styled(Checkbox)<CheckboxProps>`
    .ant-checkbox-inner {
        border-radius: var(--spacing-00) !important;
        border-color: var(--blue-z-03);
    }

    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: var(--blue-z-03);
        border-color: var(--blue-z-03);
    }

    .ant-checkbox-checked .ant-checkbox-inner::after {
        border-color: white; 
    }

    .ant-checkbox:hover .ant-checkbox-inner {
        border-color: var(--highlight);
    }

    .ant-checkbox-checked:hover .ant-checkbox-inner {
        background-color: var(--blue-z-03) !important;
        opacity: 0.7;
        border-color: var(--highlight);
    }
`

S_Checkbox.displayName = 'S_Checkbox'
export default S_Checkbox
