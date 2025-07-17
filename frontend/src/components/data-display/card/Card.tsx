import React from 'react'
import S_Card from "./Card.style";
import { CardProps } from 'antd'

export interface ExtendedCardProps extends CardProps {
    width?: string
}

const Card = ({...props}: ExtendedCardProps) => {
    return (
        <S_Card {...props} />
    )
}

export default Card
