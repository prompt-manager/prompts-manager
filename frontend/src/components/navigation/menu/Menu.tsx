import S_Menu from "./Menu.style";

import type { MenuProps } from 'antd'

const Menu = ({...props}: MenuProps) => {
    return (
        <S_Menu {...props} />
    )
}

export default Menu
