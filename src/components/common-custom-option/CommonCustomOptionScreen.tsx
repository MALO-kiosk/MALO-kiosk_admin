import { Fragment, useMemo, useState, useEffect } from 'react'
import {
  EasyCartBarTotal,
  EasyOrderActionBar,
  OutlineFrame,
  TopWhitePanel,
} from '../common'
import { getCustomOptions } from '../../utils/api'
// @ts-ignore: allow importing CSS side-effects in TSX
import '../common-option/CommonOptionScreen.css'
// @ts-ignore: allow importing SVG assets as strings
import minusIcon from '../../assets/icons/minus_icon.svg'
// @ts-ignore: allow importing SVG assets as strings
import plusIcon from '../../assets/icons/plus_icon.svg'
import { cartSummarySpec } from '../../features/easy-option'
// @ts-ignore: allow importing CSS side-effects in TSX
import '../../features/easy-option/EasyOptionScreen.css'
// @ts-ignore: allow importing CSS side-effects in TSX
import './CommonCustomOptionScreen.css'

type OptionItem = {
  id?: number
  name: string
  price: number
}

type OptionGroup = {
  id?: number
  name: string
  option_items?: OptionItem[]
}

export type CommonCustomOptionScreenProps = {
  onGoHome?: () => void
  panelTitle?: string
  onCancelOrder?: () => void
  onAddMenu?: () => void
  refreshKey?: number
}

export function CommonCustomOptionScreen({
  onGoHome,
  panelTitle = '맞춤 옵션',
  onCancelOrder,
  onAddMenu,
  refreshKey = 0,
}: CommonCustomOptionScreenProps) {
  const [optionGroups, setOptionGroups] = useState<Array<{ id?: number; name: string; items: OptionItem[]; qtys: number[] }>>([])
  const [sweetnessOptions, setSweetnessOptions] = useState<OptionItem[]>([])
  const [sweetness, setSweetness] = useState('')

  const additionalAmountWon = useMemo(() => {
    let total = 0
    for (const group of optionGroups) {
      for (let i = 0; i < group.items.length; i++) {
        const item = group.items[i]
        const qty = group.qtys[i] ?? 0
        total += qty * (Number(item.price) || 0)
      }
    }
    return total
  }, [optionGroups])

  const setGroupQtyRow = (groupIndex: number, row: number, next: (q: number) => number) => {
    setOptionGroups((groups) =>
      groups.map((g, i) =>
        i === groupIndex ? { ...g, qtys: g.qtys.map((q, j) => (j === row ? next(q) : q)) } : g
      )
    )
  }



  // DB에서 맞춤 옵션 그룹/아이템을 로드해 프리뷰에 반영
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await getCustomOptions()
        if (!mounted) return
        if (res.success && Array.isArray(res.data)) {
          const groups = res.data as OptionGroup[]

          // 당도 제외한 모든 그룹 처리
          const nonSweetnessGroups = groups
            .filter((g) => g.name !== '당도')
            .map((group) => ({
              id: group.id,
              name: group.name,
              items: (group.option_items || []).map((item) => ({
                ...item,
                price: Number(item.price) || 0,
              })),
              qtys: (group.option_items || []).map(() => 0),
            }))
          setOptionGroups(nonSweetnessGroups)

          // 당도 처리
          const sweetnessGroup = groups.find((g) => g.name === '당도')
          if (sweetnessGroup && sweetnessGroup.option_items && sweetnessGroup.option_items.length > 0) {
            const nextSweetness = sweetnessGroup.option_items.map((item) => ({
              ...item,
              price: Number(item.price) || 0,
            }))
            setSweetnessOptions(nextSweetness)
            setSweetness(nextSweetness[0].name)
          } else {
            setSweetnessOptions([])
            setSweetness('')
          }
        }
      } catch (err) {
        console.error('Failed to load custom options:', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [refreshKey])

  return (
    <div className="common-option">
      <OutlineFrame
        variant="home"
        className="common-option__back-frame"
        onHomeClick={onGoHome}
      />
      <OutlineFrame variant="staff" className="common-option__staff-frame" />
      <TopWhitePanel className="common-option__panel" heightPx={269}>
        <h1 className="common-option__title">{panelTitle}</h1>
      </TopWhitePanel>

      <div className="common-custom-option__scroll-area">
        <section className="common-custom-option__section">
          <p className="common-custom-option__section-label">당도</p>
          <div className="common-custom-option__sweetness-wrap">
            {sweetnessOptions.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`common-custom-option__sweetness-pill common-custom-option__sweetness-pill--dynamic ${
                  sweetness === item.name
                    ? 'common-custom-option__sweetness-pill--selected'
                    : 'common-custom-option__sweetness-pill--unselected'
                }`}
                aria-pressed={sweetness === item.name}
                aria-label={item.name}
                onClick={() => setSweetness(item.name)}
              >
                <span className="common-custom-option__sweetness-pill-text">{item.name}</span>
              </button>
            ))}
          </div>
        </section>

        {optionGroups.map((group, groupIndex) => (
          <section key={group.name} className="common-custom-option__section">
            <p className="common-custom-option__section-label">{group.name}</p>
            <div className="common-custom-option__list-wrap">
              {group.items.map((item, row) => (
                <div
                  className="common-custom-option__qty-row"
                  aria-label={`${item.name} 수량`}
                  key={`${group.name}-${item.name}-${row}`}
                >
                  <p className="common-custom-option__section-addon">
                    {item.name} +{item.price}원
                  </p>
                  <div className="common-custom-option__qty-controls">
                    <button
                      type="button"
                      className="common-custom-option__shot-qty-btn"
                      aria-label={`${item.name} 한 개 빼기`}
                      onClick={() => setGroupQtyRow(groupIndex, row, (q) => Math.max(0, q - 1))}
                    >
                      <img src={minusIcon} alt="" width={54} height={54} />
                    </button>
                    <span className="common-custom-option__shot-qty-val">{group.qtys[row] ?? 0}</span>
                    <button
                      type="button"
                      className="common-custom-option__shot-qty-btn"
                      aria-label={`${item.name} 한 개 더하기`}
                      onClick={() => setGroupQtyRow(groupIndex, row, (q) => q + 1)}
                    >
                      <img src={plusIcon} alt="" width={51} height={51} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <EasyCartBarTotal
        menuSpec={cartSummarySpec('ice', 'regular')}
        additionalAmountWon={additionalAmountWon}
      />
      <EasyOrderActionBar onCancel={onCancelOrder} onAddMenu={onAddMenu} />
    </div>
  )
}

export default CommonCustomOptionScreen
