import type { ProductFormFieldsReader } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { parseDecimal } from '@utils/number'

export interface ProductFormValidationError {
  key: string
  params?: Record<string, string | number>
}

const isBlank = (value: unknown): boolean =>
  value === undefined || value === null || String(value).trim() === ''

export const getProductFormValidationErrors = (
  fieldsReader: ProductFormFieldsReader
): Array<ProductFormValidationError> => {
  const errors: Array<ProductFormValidationError> = []
  if (isBlank(fieldsReader.get('name'))) {
    errors.push({ key: 'validation.name.required' })
  }
  if (isBlank(fieldsReader.get('ean13'))) {
    errors.push({ key: 'validation.ean13.required' })
  }
  const weight = fieldsReader.get('weight')
  if (isBlank(weight)) {
    errors.push({ key: 'validation.weight.required' })
  } else if (parseDecimal(weight) <= 0) {
    errors.push({ key: 'validation.weight.gt', params: { min: 0 } })
  }
  if (isBlank(fieldsReader.get('priceWithoutTax'))) {
    errors.push({ key: 'validation.priceWithoutTax.required' })
  }
  if (isBlank(fieldsReader.get('percentTaxRate'))) {
    errors.push({ key: 'validation.percentTaxRate.required' })
  }
  return errors
}
