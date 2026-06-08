import type { ReactNode } from 'react'
import './CommonMenuBottomPanel.css'

export type CommonMenuBottomPanelProps = {
  children?: ReactNode
  hasItems?: boolean
}

export function CommonMenuBottomPanel({
  children,
}: CommonMenuBottomPanelProps) {
  return (
    <div className="common-menu-bottom-panel">
      {children}
    </div>
  )
}
