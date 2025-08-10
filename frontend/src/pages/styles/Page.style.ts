import styled from 'styled-components'
import {
  Typo_body_02,
  Typo_heading_01,
  Typo_heading_03,
  Typo_heading_06_bold,
} from '../../styles/constants/typogrphy'

export interface FlexProps {
  flexDirection?: 'column' | 'row'
  gap?: number
  alignItems?: 'flex-start' | 'center' | 'flex-end'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
  padding?: string
  margin?: string
  width?: string
  height?: string
}

export interface DisabledContentProps {
  disabled?: boolean
}

export const S_FlexWrapper = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  gap: ${({ gap }) => gap}px;
  align-items: ${({ alignItems }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent};
  padding: ${({ padding }) => padding};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin: ${({ margin }) => margin};
`
S_FlexWrapper.displayName = 'S_FlexWrapper'

export const S_DisabledContent = styled.div<DisabledContentProps>`
  ${({ disabled }) =>
    disabled
      ? ` pointer-events: none;
    background: rgba(211, 211, 211, 0.8);
    border-radius: var(--radius-02);
    opacity: 0.5;`
      : null}
`
S_DisabledContent.displayName = 'S_DisabledContent'

export const S_UploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-02);
  border: 1px dashed var(--border-interactive);
  width: 100%;
  height: 10rem;
  color: var(--text-primary);

  &:hover {
    border: 1px dashed var(--highlight);
    cursor: pointer;
    background: var(--background-content);
    color: var(--highlight);
  }
`

export const S_PromptMainTitle = styled.h1`
  color: var(--text-primary);
  ${Typo_heading_06_bold};
`

export const S_PromptMainDescription = styled.p`
  color: var(--gray-06);
  ${Typo_body_02};
`

export const S_Helper = styled.span`
  color: var(--text-helper);
`

export const S_PromptVersionList = styled.div`
  width: 32rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-06);
  border-right: 0.1rem solid var(--border-primary);
  padding: var(--spacing-06);
`

export const S_PromptVersion = styled.div<{ isSelected?: boolean }>`
  padding: var(--spacing-02);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-04);
  width: 100%;
  height: 8rem;
  border-radius: var(--radius-02);
  background: ${({ isSelected }) => (isSelected ? 'var(--layer-01)' : 'transparent')};

  &:hover {
    cursor: pointer;
    border-radius: var(--radius-02);
    background: var(--highlight);
    opacity: 0.8;
  }
`

export const S_ProductionState = styled.p`
  color: var(--green-08);
`

export const S_PromptVersionDetail = styled.div`
  padding: var(--spacing-06);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-04);
  width: calc(100% - 32rem);
  height: 100%;
`

export const S_PromptVersionDetailHeader = styled.div`
  display: flex;
  gap: var(--spacing-02);
  ${Typo_heading_03};
`

export const S_PromptVersionDetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-04);
`

export const S_ThemeSwitch = styled.div`
  width: 100%;
  height: 4.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-03);
  color: var(--text-primary);
  background: var(--navy-03);
  border-radius: var(--radius-02);
  ${Typo_heading_01};
`
