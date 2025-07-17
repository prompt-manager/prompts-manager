import React from 'react'
import {TableProps} from "antd";
import {S_TableWrapper, S_Table} from "./Table.style";

const Table = ({...props}: TableProps) => {
    return (
        <S_TableWrapper>
            <S_Table {...props} />
        </S_TableWrapper>
    )
}

export default Table
