import { useCallback, useMemo, useState } from 'react'
import {
  MenuCategoryTabs,
  OrderTotalBar,
  OutlineFrame,
  ProgressBar,
  TopWhitePanel,
  type EasyCartLineItem,
} from '@/components/common'
import { CommonMenuBottomCartRow } from './CommonMenuBottomCartRow'
import { CommonMenuBottomPanel } from './CommonMenuBottomPanel'
import { CommonMenuProductCard } from './CommonMenuProductCard'
import {
  type CommonMenuSeedItem,
  COMMON_MENU_SEED_ITEMS,
} from './commonMenuDummy'
import './CommonMenuSelectScreen.css'

export type CommonMenuSelectScreenProps = {
  /** 처음으로 → 홈 */
  onGoHome?: () => void
  /** 주문하기 → 옵션 화면 */
  onOrder?: () => void
  /** 메뉴 아이템 리스트 */
  menuItems?: CommonMenuSeedItem[]
  /** 현재 선택된 메뉴 */
  selectedMenu?: CommonMenuSeedItem
}

export function CommonMenuSelectScreen({
  onGoHome,
  onOrder,
  menuItems = COMMON_MENU_SEED_ITEMS,
  selectedMenu,
}: CommonMenuSelectScreenProps) {
  const [cartLine, setCartLine] = useState<EasyCartLineItem | null>(null)

  const handleSelectMenu = useCallback((menu?: CommonMenuSeedItem) => {
    const target = menu ?? menuItems[0]
    if (!target) return

    setCartLine((prev) => {
      if (!prev || prev.id !== String(target.id)) {
        return {
          id: String(target.id),
          name: target.name,
          unitPriceWon: parseInt(target.price.replace(/[^0-9]/g, '')) || 0,
          imageSrc: target.image,
          quantity: 1,
        }
      }
      return { ...prev, quantity: prev.quantity + 1 }
    })
  }, [menuItems])

  const handleIncrement = useCallback(() => {
    setCartLine((prev) =>
      prev ? { ...prev, quantity: prev.quantity + 1 } : null,
    )
  }, [])

  const handleDecrement = useCallback(() => {
    setCartLine((prev) => {
      if (!prev) return null
      if (prev.quantity <= 1) return null
      return { ...prev, quantity: prev.quantity - 1 }
    })
  }, [])

  const handleRemoveLine = useCallback(() => {
    setCartLine(null)
  }, [])

  const totalCount = cartLine?.quantity ?? 0
  const totalPriceLabel = useMemo(() => {
    if (!cartLine) return '0'
    return (cartLine.unitPriceWon * cartLine.quantity).toLocaleString('ko-KR')
  }, [cartLine])

  const handleOrder = useCallback(() => {
    if (!cartLine) return
    onOrder?.()
  }, [cartLine, onOrder])

  return (
    <div className="common-menu-select">
      <OutlineFrame
        variant="home"
        className="common-menu-select__back-frame"
        onHomeClick={onGoHome}
      />
      <OutlineFrame variant="staff" className="common-menu-select__staff-frame" />

      <TopWhitePanel as="main" autoHeight minHeightPx={287}>
        <MenuCategoryTabs />
      </TopWhitePanel>

      <div className="common-menu-select__product-grid">
        {menuItems.map((menu) => (
          <div key={menu.id} className="common-menu-select__product-row">
            <CommonMenuProductCard
              imageSrc={menu.image}
              name={menu.name}
              priceLabel={menu.price}
              onSelect={() => handleSelectMenu(menu)}
            />
          </div>
        ))}
      </div>

      <ProgressBar />

      <CommonMenuBottomPanel>
        {cartLine ? (
          <CommonMenuBottomCartRow
            item={cartLine}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemoveLine={handleRemoveLine}
          />
        ) : null}
      </CommonMenuBottomPanel>

      <OrderTotalBar
        totalCount={totalCount}
        totalPrice={totalPriceLabel}
        onOrder={handleOrder}
      />
    </div>
  )
}

export default CommonMenuSelectScreen
