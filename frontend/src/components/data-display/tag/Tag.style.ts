import styled from 'styled-components'
import { Tag } from 'antd'

interface StyleProps {
  $tagType?: 'full' | 'outline'
  $color?: string
  $borderColor?: string
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

  ${({
    $tagType = 'full',
    $color = 'var(--tag-primary)',
    $borderColor = 'var(--border-interactive)',
    $clickable = true,
  }) => {
    if ($tagType === 'outline') {
      return `
        background: transparent;
        border:.1rem solid ${$borderColor};
        color: ${$color};
        transition: all 0.2s;

        ${
          $clickable
            ? `&:hover {
                cursor: pointer;
                border-color: var(--highlight);
                color: var(--highlight);
              }`
            : ''
        }
      `
    } else {
      return `
        background: ${$color};
        border:.1rem solid ${$borderColor};
        color: var(--white);
        transition: all 0.2s;

        ${
          $clickable
            ? `&:hover {
            color: ${$color};
                cursor: pointer;
                background: var(--highlight);
              }`
            : ''
        }
      `
    }
  }}
`

S_Tag.displayName = 'S_Tag'
export default S_Tag
