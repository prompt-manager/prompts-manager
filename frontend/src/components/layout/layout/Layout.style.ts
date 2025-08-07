import styled from "styled-components";
import {Layout} from "antd";

const S_Layout = styled(Layout)`
    height: 100vh;
    border: .1rem solid var(--border-primary);
    background: var(--background)
`
S_Layout.displayName = 'S_Layout'

export default S_Layout
