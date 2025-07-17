import React from 'react';
import {S_Content} from "./Content.style";

const Content = ({ children }: {children: React.ReactNode}) => {
    return <S_Content>
        {children}
    </S_Content>
}

export default Content;
