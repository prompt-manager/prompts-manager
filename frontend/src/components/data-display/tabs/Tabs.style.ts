import {Tabs} from 'antd'
import styled from 'styled-components'
import {Typo_body_02, Typo_heading_02} from "../../../styles/constants/typogrphy";

const S_Tabs = styled(Tabs)`
    .ant-tabs-ink-bar {
        background-color: var(--background-active);
    }
    .ant-tabs-tab-active .ant-tabs-tab-btn {
        color: var(--text-active) !important;
        ${Typo_heading_02};
    }
    .ant-tabs-tab-btn {
        color: var(--text-primary);
        ${Typo_body_02};
    }
        
        .ant-tabs-tab:hover .ant-tabs-tab-btn {
                color: var(--highlight);
        }
    
`

S_Tabs.displayName = 'S_Tabs'

export default S_Tabs
