import { Layout } from 'antd'
import styled from 'styled-components'

export const S_Content = styled(Layout.Content)`
  position: relative;
  flex: 1;
  min-height: initial;
  padding: var(--spacing-08);
  background: var(--background);
  color: black;
  overflow: auto;
`
S_Content.displayName = 'S_Content'
