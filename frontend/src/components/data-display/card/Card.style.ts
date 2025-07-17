import { Card } from 'antd'
import styled from 'styled-components'
import { ExtendedCardProps } from './Card'

const S_Card = styled(Card)<ExtendedCardProps>`
 .ant-card-body {
     width: ${({ width }) => width} !important;
 }
`

S_Card.displayName = 'S_Card'
export default S_Card
