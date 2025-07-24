import styled from 'styled-components'
import { Tag } from 'antd'

interface StyleProps {
  $tagType?: 'full' | 'outline'
  $color?: string
  $clickable?: boolean
  width?: string
}

const S_Tag = styled(Tag)<StyleProps>`
  ${({ width }) => `
    width: ${width ?? 'fit-content'};
  `}

  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ $tagType = 'full', $color = '#3aafc7', $clickable = true }) => {
    if ($tagType === 'outline') {
      return `
        background: transparent;
        border: 1px solid ${$color};
        color: ${$color};
        transition: all 0.2s;

        ${
          $clickable
            ? `&:hover {
                cursor: pointer;
                border-color: var(--yellow-z-01);
                color: var(--yellow-z-01);
              }`
            : ''
        }
      `
    } else {
      return `
        background: ${$color};
        border: none;
        color: var(--white);
        transition: all 0.2s;

        ${
          $clickable
            ? `&:hover {
                cursor: pointer;
                background: var(--yellow-z-01);
              }`
            : ''
        }
      `
    }
  }}
`

S_Tag.displayName = 'S_Tag'
export default S_Tag
