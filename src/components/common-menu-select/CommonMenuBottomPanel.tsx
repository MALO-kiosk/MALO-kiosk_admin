import type { ReactNode } from 'react'
import './CommonMenuBottomPanel.css'

export type CommonMenuBottomPanelProps = {
  children?: ReactNode
  hasItems?: boolean
}

export function CommonMenuBottomPanel({
  children,
  hasItems = false,
}: CommonMenuBottomPanelProps) {
  return (
    <div className="common-menu-bottom-panel">
      {hasItems ? <hr className="common-menu-bottom-panel__rule" aria-hidden /> : null}
      {children}
    </div>
  )
}
