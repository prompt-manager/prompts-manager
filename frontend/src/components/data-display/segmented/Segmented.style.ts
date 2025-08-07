import { Segmented, SegmentedProps } from "antd"
import styled from "styled-components"

const S_Segmented = styled(Segmented)<SegmentedProps>`
    width: 7.8rem;
    .ant-segmented-item {
    background-color: var(--white);
    color: var(--gray-06);
    transition: all 0.3s ease;
}

    .ant-segmented-item:hover {
        background-color: var(--highlight);
        color: var(--black);
    }

    .ant-segmented-item-selected {
        background-color: var(--background-active); 
        color: var(--white);
        font-weight: bold;
    }
`

S_Segmented.displayName = "S_Segmented"
export default S_Segmented
