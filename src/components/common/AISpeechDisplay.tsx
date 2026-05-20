import type { CSSProperties } from 'react'
import './AISpeechDisplay.css'

const personIcon = `${import.meta.env.BASE_URL}img/hugeicons_user-03.svg`

export type AISpeechDisplayProps = {
  /** 안내 문구 */
  message?: string
  className?: string
  style?: CSSProperties
}

export function AISpeechDisplay({
  message = '원하시는 음료를 선택해주세요',
  className,
  style,
}: AISpeechDisplayProps) {
  const rootClass = className
    ? `ai-speech-display ${className}`
    : 'ai-speech-display'

  return (
    <div className={rootClass} style={style}>
      <div className="ai-speech-display__bubble">
        <p className="ai-speech-display__text">{message}</p>
      </div>
      <img
        src={personIcon}
        alt=""
        className="ai-speech-display__person"
        width={120}
        height={120}
      />
    </div>
  )
}
