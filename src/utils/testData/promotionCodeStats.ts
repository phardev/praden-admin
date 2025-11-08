import { PromotionCodeStats } from '@core/entities/promotionCodeStats'

export const newSitePromotionCodeStats: PromotionCodeStats = {
  usageCount: 0,
  totalSales: 0,
  totalDiscountGiven: 0,
  emailUsages: []
}

export const fifteenPercentPromotionCodeStats: PromotionCodeStats = {
  usageCount: 42,
  totalSales: 350000,
  totalDiscountGiven: 52500,
  emailUsages: [
    { email: 'client1@example.com', usageCount: 15 },
    { email: 'client2@example.com', usageCount: 12 },
    { email: 'client3@example.com', usageCount: 10 },
    { email: 'client4@example.com', usageCount: 5 }
  ]
}

export const fifteenPercentIfMiniumAmountPromotionCodeStats: PromotionCodeStats =
  {
    usageCount: 20,
    totalSales: 500000,
    totalDiscountGiven: 75000,
    emailUsages: [
      { email: 'bigclient@example.com', usageCount: 8 },
      { email: 'anotherbig@example.com', usageCount: 7 },
      { email: 'premium@example.com', usageCount: 5 }
    ]
  }

export const tenEuroFixedPromotionCodeStats: PromotionCodeStats = {
  usageCount: 25,
  totalSales: 125000,
  totalDiscountGiven: 12500,
  emailUsages: [
    { email: 'test@test.com', usageCount: 10 },
    { email: 'another@email.com', usageCount: 15 }
  ]
}

export const limitedInTimePromotionCodeStats: PromotionCodeStats = {
  usageCount: 150,
  totalSales: 1200000,
  totalDiscountGiven: 150000,
  emailUsages: [
    { email: 'flash@customer.com', usageCount: 50 },
    { email: 'quick@buyer.com', usageCount: 40 },
    { email: 'fast@shopper.com', usageCount: 35 },
    { email: 'speedy@client.com', usageCount: 25 }
  ]
}

export const limitedPromotionCodeStats: PromotionCodeStats = {
  usageCount: 85,
  totalSales: 680000,
  totalDiscountGiven: 85000,
  emailUsages: [
    { email: 'limited1@example.com', usageCount: 25 },
    { email: 'limited2@example.com', usageCount: 20 },
    { email: 'limited3@example.com', usageCount: 18 },
    { email: 'limited4@example.com', usageCount: 12 },
    { email: 'limited5@example.com', usageCount: 10 }
  ]
}

export const deliveryPromotionCodeStats: PromotionCodeStats = {
  usageCount: 200,
  totalSales: 800000,
  totalDiscountGiven: 100000,
  emailUsages: [
    { email: 'delivery1@example.com', usageCount: 30 },
    { email: 'delivery2@example.com', usageCount: 28 },
    { email: 'delivery3@example.com', usageCount: 25 },
    { email: 'delivery4@example.com', usageCount: 22 },
    { email: 'delivery5@example.com', usageCount: 20 },
    { email: 'delivery6@example.com', usageCount: 18 },
    { email: 'delivery7@example.com', usageCount: 15 },
    { email: 'delivery8@example.com', usageCount: 12 },
    { email: 'delivery9@example.com', usageCount: 10 },
    { email: 'delivery10@example.com', usageCount: 8 },
    { email: 'delivery11@example.com', usageCount: 6 },
    { email: 'delivery12@example.com', usageCount: 6 }
  ]
}

export const productRestrictedPromotionCodeStats: PromotionCodeStats = {
  usageCount: 15,
  totalSales: 45000,
  totalDiscountGiven: 4500,
  emailUsages: [
    { email: 'hemoclar@fan.com', usageCount: 8 },
    { email: 'product@lover.com', usageCount: 7 }
  ]
}
