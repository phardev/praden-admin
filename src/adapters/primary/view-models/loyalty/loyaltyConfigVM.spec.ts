import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getLoyaltyConfigVM } from './loyaltyConfigVM'

describe('loyaltyConfigVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return null when config not set', () => {
    const result = getLoyaltyConfigVM()

    expect(result).toStrictEqual(null)
  })

  it('should return points ratio from store', () => {
    const store = useLoyaltyStore()
    store.setConfig({ pointsRatio: 10 })

    const result = getLoyaltyConfigVM()

    expect(result?.pointsRatio).toStrictEqual(10)
  })

  it('should return different points ratio', () => {
    const store = useLoyaltyStore()
    store.setConfig({ pointsRatio: 5 })

    const result = getLoyaltyConfigVM()

    expect(result?.pointsRatio).toStrictEqual(5)
  })
})
