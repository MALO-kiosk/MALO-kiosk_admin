import { useCallback, useMemo, useState } from 'react'
import {
  MenuCategoryTabs,
  OrderTotalBar,
  OutlineFrame,
  ProgressBar,
  TopWhitePanel,
  type CoffeeDetailCategoryId,
  type EasyCartLineItem,
  type MenuCategoryId,
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
  activePrimaryCategory?: MenuCategoryId
  activeCoffeeDetailCategory?: CoffeeDetailCategoryId
  onPrimaryCategoryChange?: (category: MenuCategoryId) => void
  onCoffeeDetailCategoryChange?: (category: CoffeeDetailCategoryId) => void
}

export function CommonMenuSelectScreen({
  onGoHome,
  onOrder,
  menuItems = COMMON_MENU_SEED_ITEMS,
  selectedMenu,
  activePrimaryCategory: controlledPrimaryCategory,
  activeCoffeeDetailCategory: controlledCoffeeDetailCategory,
  onPrimaryCategoryChange,
  onCoffeeDetailCategoryChange,
}: CommonMenuSelectScreenProps) {
  const [cartLines, setCartLines] = useState<EasyCartLineItem[]>([])
  const [localActivePrimaryCategory, setLocalActivePrimaryCategory] =
    useState<MenuCategoryId>('coffee')
  const [localActiveCoffeeDetailCategory, setLocalActiveCoffeeDetailCategory] =
    useState<CoffeeDetailCategoryId>('coffee')

  const resolvedPrimaryCategory = controlledPrimaryCategory ?? localActivePrimaryCategory
  const resolvedCoffeeDetailCategory = controlledCoffeeDetailCategory ?? localActiveCoffeeDetailCategory

  const normalizePrimaryCategory = useCallback((value?: string) => {
    if (!value) return null
    const normalized = value.trim().toLowerCase()
    if (['추천', 'recommended'].includes(normalized)) return 'recommended'
    if (['신메뉴', 'new'].includes(normalized)) return 'new'
    if (['커피/음료', '커피', 'coffee/음료', 'coffee'].includes(normalized)) return 'coffee'
    if (['디저트', 'dessert'].includes(normalized)) return 'dessert'
    return null
  }, [])

  const normalizeCoffeeDetailCategory = useCallback((value?: string) => {
    if (!value) return null
    const normalized = value.trim().toLowerCase()
    if (['커피', 'coffee'].includes(normalized)) return 'coffee'
    if (['디카페인 커피', '디카페인', 'decaf'].includes(normalized)) return 'decaf'
    if (['음료', 'drink'].includes(normalized)) return 'drink'
    if (['티/라떼', '티', '라떼', 'tea', 'latte'].includes(normalized)) return 'tea'
    return null
  }, [])

  const inferCoffeeDetailCategoryByName = useCallback((name?: string) => {
    if (!name) return null
    const normalized = name.trim().toLowerCase()

    if (normalized.includes('디카페인') || normalized.includes('decaf')) return 'decaf'
    if (
      normalized.includes('티') ||
      normalized.includes('tea') ||
      normalized.includes('라떼') ||
      normalized.includes('latte')
    ) {
      return 'tea'
    }
    if (
      normalized.includes('에이드') ||
      normalized.includes('주스') ||
      normalized.includes('스무디') ||
      normalized.includes('음료') ||
      normalized.includes('ade') ||
      normalized.includes('juice') ||
      normalized.includes('smoothie')
    ) {
      return 'drink'
    }
    if (
      normalized.includes('커피') ||
      normalized.includes('아메리카노') ||
      normalized.includes('에스프레소') ||
      normalized.includes('카푸치노') ||
      normalized.includes('coffee') ||
      normalized.includes('espresso') ||
      normalized.includes('cappuccino')
    ) {
      return 'coffee'
    }

    return null
  }, [])

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((menu) => {
      const rawPrimary = menu.primary_category || menu.category_primary || menu.category
      const primaryCategory = normalizePrimaryCategory(rawPrimary)
      const isCoffeeGroupItem =
        primaryCategory === 'coffee' ||
        primaryCategory === 'recommended' ||
        primaryCategory === 'new'

      if (resolvedPrimaryCategory === 'dessert') {
        return primaryCategory === 'dessert'
      }

      if (resolvedPrimaryCategory === 'recommended') {
        if (primaryCategory !== 'recommended') return false
      } else if (resolvedPrimaryCategory === 'new') {
        if (primaryCategory !== 'new') return false
      } else if (resolvedPrimaryCategory === 'coffee') {
        if (!isCoffeeGroupItem) return false
      } else {
        return primaryCategory === resolvedPrimaryCategory
      }

      const rawSecondary = menu.secondary_category || menu.category_secondary || menu.subcategory
      const detailCategory =
        normalizeCoffeeDetailCategory(rawSecondary) ||
        inferCoffeeDetailCategoryByName(menu.name)

      if (!detailCategory) return false

      return detailCategory === resolvedCoffeeDetailCategory
    })
  }, [
    inferCoffeeDetailCategoryByName,
    menuItems,
    normalizeCoffeeDetailCategory,
    normalizePrimaryCategory,
    resolvedCoffeeDetailCategory,
    resolvedPrimaryCategory,
  ])

  const handleSelectMenu = useCallback((menu?: CommonMenuSeedItem) => {
    const target = menu ?? menuItems[0]
    if (!target) return

    setCartLines((prev) => {
      const targetId = String(target.id)
      const existingIndex = prev.findIndex((line) => line.id === targetId)

      if (existingIndex === -1) {
        return [
          ...prev,
          {
            id: targetId,
            name: target.name,
            unitPriceWon: parseInt(target.price.replace(/[^0-9]/g, '')) || 0,
            imageSrc: target.image,
            quantity: 1,
          },
        ]
      }

      return prev.map((line, index) =>
        index === existingIndex
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      )
    })
  }, [menuItems])

  const handleIncrement = useCallback((lineId: string) => {
    setCartLines((prev) =>
      prev.map((line) =>
        line.id === lineId ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    )
  }, [])

  const handleDecrement = useCallback((lineId: string) => {
    setCartLines((prev) =>
      prev
        .map((line) =>
          line.id === lineId ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }, [])

  const handleRemoveLine = useCallback((lineId: string) => {
    setCartLines((prev) => prev.filter((line) => line.id !== lineId))
  }, [])

  const totalCount = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines],
  )
  const totalPriceLabel = useMemo(() => {
    if (cartLines.length === 0) return '0'
    const totalPriceWon = cartLines.reduce(
      (sum, line) => sum + line.unitPriceWon * line.quantity,
      0,
    )
    return totalPriceWon.toLocaleString('ko-KR')
  }, [cartLines])

  const handleOrder = useCallback(() => {
    if (cartLines.length === 0) return
    onOrder?.()
  }, [cartLines, onOrder])

  return (
    <div className="common-menu-select">
      <OutlineFrame
        variant="home"
        className="common-menu-select__back-frame"
        onHomeClick={onGoHome}
      />
      <OutlineFrame variant="staff" className="common-menu-select__staff-frame" />

      <TopWhitePanel as="main" autoHeight minHeightPx={287}>
        <MenuCategoryTabs
          activeId={resolvedPrimaryCategory}
          activeCoffeeDetail={resolvedCoffeeDetailCategory}
          onPrimaryCategoryChange={(category) => {
            setLocalActivePrimaryCategory(category)
            onPrimaryCategoryChange?.(category)
          }}
          onCoffeeDetailCategoryChange={(category) => {
            setLocalActiveCoffeeDetailCategory(category)
            onCoffeeDetailCategoryChange?.(category)
          }}
        />
      </TopWhitePanel>

      <div className="common-menu-select__product-grid">
        {filteredMenuItems.map((menu) => (
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

      <CommonMenuBottomPanel hasItems={cartLines.length > 0}>
        {cartLines.map((cartLine) => (
          <CommonMenuBottomCartRow
            key={cartLine.id}
            item={cartLine}
            onIncrement={() => handleIncrement(cartLine.id)}
            onDecrement={() => handleDecrement(cartLine.id)}
            onRemoveLine={() => handleRemoveLine(cartLine.id)}
          />
        ))}
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
