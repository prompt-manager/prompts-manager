import styled from 'styled-components'
import { Typo_heading_06_bold, Typo_heading_07_bold } from '../../styles/constants/typogrphy'

export const S_HomeWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-08) var(--spacing-12);
`
S_HomeWrapper.displayName = 'S_HomeWrapper'

export const S_HomeContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-08);
  background-color: var(--background-content);
  padding: var(--spacing-08) var(--spacing-04);
  width: 75rem;
  height: 60rem;
  border: 0.2rem solid var(--border-primary);
  border-radius: var(--radius-02);
`
S_HomeContent.displayName = 'S_HomeContent'

export const S_HomeTitle = styled.h1`
  ${Typo_heading_07_bold};
  color: var(--text-primary);
  padding: var(--spacing-04);
  text-align: center;
`
S_HomeTitle.displayName = 'S_HomeTitle'

export const S_HomeMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-09);
  border-radius: var(--radius-01);
  padding: var(--spacing-02) var(--spacing-04);
  ${Typo_heading_06_bold};
  color: var(--text-primary);
`
S_HomeMenuWrapper.displayName = 'S_HomeMenuWrapper'

export const S_HomeMenu = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--background-active);
  border-radius: var(--radius-01);
  padding: var(--spacing-02) var(--spacing-04);
  cursor: pointer;

  &:hover {
    color: var(--text-secondary);
    border: 0.4rem solid var(--highlight);
  }
`
S_HomeMenu.displayName = 'S_HomeMenu'
