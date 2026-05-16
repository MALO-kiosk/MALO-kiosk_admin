import { Fragment, useMemo, useState, useEffect } from 'react'
import {
  EasyCartBarTotal,
  EasyOrderActionBar,
  OutlineFrame,
  TopWhitePanel,
} from '../common'
import { getCustomOptions } from '../../utils/api'
import '../common-option/CommonOptionScreen.css'
import minusIcon from '../../assets/icons/minus_icon.svg'
import plusIcon from '../../assets/icons/plus_icon.svg'
import { cartSummarySpec } from '../../features/easy-option'
import '../../features/easy-option/EasyOptionScreen.css'
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

const DEFAULT_SHOT_OPTION: OptionItem = { name: '샷 추가', price: 500 }
const DEFAULT_SYRUP_OPTION: OptionItem = { name: '바닐라 시럽', price: 500 }
const DEFAULT_SWEETNESS_OPTIONS: OptionItem[] = [
  { name: '더 달게', price: 0 },
  { name: '보통', price: 0 },
  { name: '덜 달게', price: 0 },
]
const DEFAULT_PEARL_OPTIONS: OptionItem[] = [
  { name: '타피오카펄', price: 500 },
  { name: '화이트펄', price: 500 },
  { name: '알로에', price: 500 },
]

export type CommonCustomOptionScreenProps = {
  onGoHome?: () => void
  panelTitle?: string
  onCancelOrder?: () => void
  onAddMenu?: () => void
}

export function CommonCustomOptionScreen({
  onGoHome,
  panelTitle = '맞춤 옵션',
  onCancelOrder,
  onAddMenu,
}: CommonCustomOptionScreenProps) {
  const [shotQty, setShotQty] = useState(0)
  const [syrupQty, setSyrupQty] = useState(0)
  const [pearlQtys, setPearlQtys] = useState([0, 0, 0])
  const [sweetness, setSweetness] = useState(DEFAULT_SWEETNESS_OPTIONS[0].name)
  const [shotOption, setShotOption] = useState<OptionItem>(DEFAULT_SHOT_OPTION)
  const [syrupOption, setSyrupOption] = useState<OptionItem>(DEFAULT_SYRUP_OPTION)
  const [sweetnessOptions, setSweetnessOptions] = useState<OptionItem[]>(
    DEFAULT_SWEETNESS_OPTIONS,
  )
  const [pearlOptions, setPearlOptions] = useState<OptionItem[]>(
    DEFAULT_PEARL_OPTIONS,
  )

  const additionalAmountWon = useMemo(() => {
    const pearlSum = pearlQtys.reduce((sum, qty, i) => {
      const price = pearlOptions[i]?.price ?? 0
      return sum + qty * price
    }, 0)
    return shotQty * shotOption.price + syrupQty * syrupOption.price + pearlSum
  }, [shotQty, syrupQty, pearlQtys, pearlOptions, shotOption.price, syrupOption.price])

  const setPearlQtyRow = (row: number, next: (q: number) => number) => {
    setPearlQtys((rows) => rows.map((q, i) => (i === row ? next(q) : q)))
  }

  const findItemsByGroupName = (groups: OptionGroup[], name: string) => {
    const group = groups.find((g) => g.name === name)
    if (!group || !Array.isArray(group.option_items) || group.option_items.length === 0) {
      return null
    }
    return [...group.option_items].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
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

          const shotItems = findItemsByGroupName(groups, '샷')
          if (shotItems && shotItems[0]) {
            setShotOption({
              name: shotItems[0].name,
              price: Number(shotItems[0].price) || 0,
            })
          }

          const syrupItems = findItemsByGroupName(groups, '시럽')
          if (syrupItems && syrupItems[0]) {
            setSyrupOption({
              name: syrupItems[0].name,
              price: Number(syrupItems[0].price) || 0,
            })
          }

          const loadedSweetness = findItemsByGroupName(groups, '당도')
          if (loadedSweetness && loadedSweetness.length > 0) {
            const nextSweetness = loadedSweetness.slice(0, 3).map((item) => ({
              name: item.name,
              price: Number(item.price) || 0,
            }))
            setSweetnessOptions(nextSweetness)
            setSweetness(nextSweetness[0].name)
          }

          const loadedPearl = findItemsByGroupName(groups, '펄')
          if (loadedPearl && loadedPearl.length > 0) {
            const nextPearl = loadedPearl.slice(0, 3).map((item) => ({
              name: item.name,
              price: Number(item.price) || 0,
            }))
            setPearlOptions(nextPearl)
            setPearlQtys(nextPearl.map(() => 0))
          }
        }
      } catch (err) {
        // keep defaults if DB fetch fails
      }
    })()
    return () => { mounted = false }
  }, [])

  const shownSweetness = [...sweetnessOptions]
    .slice(0, 3)
    .concat(
      DEFAULT_SWEETNESS_OPTIONS.slice(
        0,
        Math.max(0, 3 - Math.min(3, sweetnessOptions.length)),
      ),
    )
    .slice(0, 3)

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

      <p className="common-custom-option__shot-label">샷</p>
      <p className="common-custom-option__shot-addon">
        {shotOption.name} +{shotOption.price}원
      </p>

      <div className="common-custom-option__shot-qty" aria-label="샷 수량">
        <button
          type="button"
          className="common-custom-option__shot-qty-btn"
          aria-label="샷 한 개 빼기"
          onClick={() => setShotQty((q) => Math.max(0, q - 1))}
        >
          <img src={minusIcon} alt="" width={54} height={54} />
        </button>
        <span className="common-custom-option__shot-qty-val">{shotQty}</span>
        <button
          type="button"
          className="common-custom-option__shot-qty-btn"
          aria-label="샷 한 개 더하기"
          onClick={() => setShotQty((q) => q + 1)}
        >
          <img src={plusIcon} alt="" width={51} height={51} />
        </button>
      </div>

      <p className="common-custom-option__syrup-label">시럽</p>
      <p className="common-custom-option__syrup-addon">
        {syrupOption.name} +{syrupOption.price}원
      </p>
      <div className="common-custom-option__syrup-qty" aria-label="바닐라 시럽 수량">
        <button
          type="button"
          className="common-custom-option__shot-qty-btn"
          aria-label="바닐라 시럽 한 스푼 빼기"
          onClick={() => setSyrupQty((q) => Math.max(0, q - 1))}
        >
          <img src={minusIcon} alt="" width={54} height={54} />
        </button>
        <span className="common-custom-option__shot-qty-val">{syrupQty}</span>
        <button
          type="button"
          className="common-custom-option__shot-qty-btn"
          aria-label="바닐라 시럽 한 스푼 더하기"
          onClick={() => setSyrupQty((q) => q + 1)}
        >
          <img src={plusIcon} alt="" width={51} height={51} />
        </button>
      </div>

      <p className="common-custom-option__sweetness-label">당도</p>

      <button
        type="button"
        className={`common-custom-option__sweetness-pill common-custom-option__sweetness-pill--slot-more ${sweetness === shownSweetness[0].name ? 'common-custom-option__sweetness-pill--selected' : 'common-custom-option__sweetness-pill--unselected'}`}
        aria-pressed={sweetness === shownSweetness[0].name}
        aria-label={shownSweetness[0].name}
        onClick={() => setSweetness(shownSweetness[0].name)}
      >
        <span className="common-custom-option__sweetness-pill-text">{shownSweetness[0].name}</span>
      </button>
      <button
        type="button"
        className={`common-custom-option__sweetness-pill common-custom-option__sweetness-pill--slot-normal ${sweetness === shownSweetness[1].name ? 'common-custom-option__sweetness-pill--selected' : 'common-custom-option__sweetness-pill--unselected'}`}
        aria-pressed={sweetness === shownSweetness[1].name}
        aria-label={shownSweetness[1].name}
        onClick={() => setSweetness(shownSweetness[1].name)}
      >
        <span className="common-custom-option__sweetness-pill-text">{shownSweetness[1].name}</span>
      </button>
      <button
        type="button"
        className={`common-custom-option__sweetness-pill common-custom-option__sweetness-pill--slot-less ${sweetness === shownSweetness[2].name ? 'common-custom-option__sweetness-pill--selected' : 'common-custom-option__sweetness-pill--unselected'}`}
        aria-pressed={sweetness === shownSweetness[2].name}
        aria-label={shownSweetness[2].name}
        onClick={() => setSweetness(shownSweetness[2].name)}
      >
        <span className="common-custom-option__sweetness-pill-text common-custom-option__sweetness-pill-text--fluid">
          {shownSweetness[2].name}
        </span>
      </button>

      <p className="common-custom-option__pearl-label">펄</p>
      {pearlOptions.slice(0, 3).map((item, row) => (
        <Fragment key={row}>
          <p
            className={`common-custom-option__pearl-addon common-custom-option__pearl-addon--r${row}`}
          >
            {item.name} + {item.price}원
          </p>
          <div
            className={`common-custom-option__pearl-qty common-custom-option__pearl-qty--r${row}`}
            aria-label={`${item.name} 수량 ${row + 1}행`}
          >
            <button
              type="button"
              className="common-custom-option__pearl-qty-btn"
              aria-label={`${item.name} ${row + 1}행 한 개 빼기`}
              onClick={() => setPearlQtyRow(row, (q) => Math.max(0, q - 1))}
            >
              <img src={minusIcon} alt="" width={54} height={54} />
            </button>
            <span className="common-custom-option__pearl-qty-val">
              {pearlQtys[row]}
            </span>
            <button
              type="button"
              className="common-custom-option__pearl-qty-btn"
              aria-label={`${item.name} ${row + 1}행 한 개 더하기`}
              onClick={() => setPearlQtyRow(row, (q) => q + 1)}
            >
              <img src={plusIcon} alt="" width={51} height={51} />
            </button>
          </div>
        </Fragment>
      ))}

      <EasyCartBarTotal
        menuSpec={cartSummarySpec('ice', 'regular')}
        additionalAmountWon={additionalAmountWon}
      />
      <EasyOrderActionBar onCancel={onCancelOrder} onAddMenu={onAddMenu} />
    </div>
  )
}

export default CommonCustomOptionScreen
