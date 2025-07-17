import React from 'react';
import {S_Header} from "./Header.style";

const Header = ({children}: {children: React.ReactNode}) => {
    return <S_Header>{children}</S_Header>
}

export default Header;
