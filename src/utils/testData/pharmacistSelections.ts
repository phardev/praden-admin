import { PharmacistSelection } from '@core/entities/pharmacistSelection'

export const pharmacistSelection1: PharmacistSelection = {
  productUuids: [
    'product-dolodent',
    'product-ultralevure',
    'product-anaca3minceur',
    'product-chamomilla'
  ]
}

export const pharmacistSelection2: PharmacistSelection = {
  productUuids: ['product-dolodent', 'product-chamomilla']
}

export const emptyPharmacistSelection: PharmacistSelection = {
  productUuids: []
}
