export function cartSummarySpec(temp: 'ice' | 'hot', size: 'regular' | 'large') {
  return `${temp === 'ice' ? 'ICE' : 'HOT'} / ${size === 'regular' ? 'R' : 'L'}`
}
