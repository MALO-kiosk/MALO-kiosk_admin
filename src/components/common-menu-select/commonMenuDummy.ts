import type { EasyCartLineItem } from '../common'

export type CommonMenuSeedItem = {
  id: number
  name: string
  price: string
  image: string
  primary_category?: string
  secondary_category?: string
  category_primary?: string
  category_secondary?: string
  category?: string
  subcategory?: string
}

export const COMMON_MENU_SEED_ITEMS: CommonMenuSeedItem[] = [
  { id: 1, name: '아메리카노', price: '3,000원', image: '/img/coffee.svg' },
  { id: 2, name: '카페라떼', price: '3,500원', image: '/img/latte.svg' },
  { id: 3, name: '녹차', price: '3,000원', image: '/img/tea.svg' },
  { id: 4, name: '스트로베리말차', price: '3,900원', image: '/img/Rectangle.svg' },
  { id: 5, name: '에스프레소', price: '2,500원', image: '/img/coffee.svg' },
]

export type CommonMenuDummyProduct = {
  id: string
  imageSrc: string
  name: string
  priceLabel: string
}

export const COMMON_MENU_DUMMY_PRODUCT: CommonMenuDummyProduct = {
  id: 'common-menu-dummy-product',
  imageSrc: '/img/Rectangle.svg',
  name: '스트로베리말차',
  priceLabel: '3,900원',
}

export const commonMenuDummyCartLine = (
  quantity: number,
): EasyCartLineItem => ({
  id: COMMON_MENU_DUMMY_PRODUCT.id,
  name: COMMON_MENU_DUMMY_PRODUCT.name,
  unitPriceWon: 3900,
  imageSrc: COMMON_MENU_DUMMY_PRODUCT.imageSrc,
  quantity,
})