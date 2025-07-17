import React from 'react';
import {SegmentedProps} from "antd";
import S_Segmented from "./Segmented.style";

const Segmented = ({ ...props }: SegmentedProps) => {
    return (
        <S_Segmented {...props} />
    )
}

export default Segmented
