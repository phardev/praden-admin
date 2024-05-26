import { useFormStore } from '@store/formStore'
import { type Category } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { type Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { type UUID } from '@core/types/types'
import { getFileContent } from '@utils/file'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { addTaxToPrice, removeTaxFromPrice } from '@utils/price'

export type CreateProductCategoriesVM = Array<Pick<Category, 'uuid' | 'name'>>

export class CreateProductVM {
  protected readonly key: string
  protected formStore: any
  protected categoryStore: any
  protected images: Array<string> = []

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.categoryStore = useCategoryStore()
    this.formStore.set(this.key, {
      name: '',
      categoryUuid: undefined,
      cip7: '',
      cip13: '',
      ean13: '',
      priceWithoutTax: undefined,
      percentTaxRate: undefined,
      priceWithTax: undefined,
      laboratory: '',
      location: '',
      availableStock: '',
      newImages: [],
      description: '',
      instructionsForUse: '',
      composition: ''
    })
  }

  getName(): Field<string> {
    return {
      value: this.formStore.get(this.key).name,
      canEdit: true
    }
  }
  setName(name: string): void {
    this.formStore.set(this.key, { name })
  }

  getCategoryUuid(): Field<UUID | undefined> {
    return {
      value: this.formStore.get(this.key).categoryUuid,
      canEdit: true
    }
  }

  setCategoryUuid(categoryUuid: UUID | undefined): void {
    this.formStore.set(this.key, { categoryUuid })
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    const categories = this.categoryStore.items
    return categories.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name
      }
    })
  }

  getCip7(): Field<string> {
    return {
      value: this.formStore.get(this.key).cip7,
      canEdit: true
    }
  }
  setCip7(cip7: string): void {
    this.formStore.set(this.key, { cip7 })
  }

  getCip13(): Field<string> {
    return {
      value: this.formStore.get(this.key).cip13,
      canEdit: true
    }
  }
  setCip13(cip13: string): void {
    this.formStore.set(this.key, { cip13 })
  }

  getEan13(): Field<string> {
    return {
      value: this.formStore.get(this.key).ean13,
      canEdit: true
    }
  }
  setEan13(ean13: string): void {
    this.formStore.set(this.key, { ean13 })
  }

  getPriceWithoutTax(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).priceWithoutTax,
      canEdit: true
    }
  }
  setPriceWithoutTax(priceWithoutTax: string | undefined): void {
    this.formStore.set(this.key, { priceWithoutTax })
    const taxRate = this.getPercentTaxRate().value
    if (taxRate) {
      const newPriceWithTax = addTaxToPrice(+priceWithoutTax, taxRate).toFixed(
        2
      )
      if (newPriceWithTax !== this.getPriceWithTax().value) {
        this.formStore.set(this.key, { priceWithTax: newPriceWithTax })
      }
    }
  }

  getPercentTaxRate(): Field<number | undefined> {
    return {
      value: this.formStore.get(this.key).percentTaxRate,
      canEdit: true
    }
  }

  setPercentTaxRate(percentTaxRate: string | undefined): void {
    this.formStore.set(this.key, { percentTaxRate })
    const priceWithoutTax = this.getPriceWithoutTax().value
    const priceWithTax = this.getPriceWithTax().value
    if (priceWithTax && !priceWithoutTax) {
      const newPriceWithoutTax = removeTaxFromPrice(
        +priceWithTax,
        +percentTaxRate
      ).toFixed(2)
      if (newPriceWithoutTax !== this.getPriceWithoutTax().value) {
        this.formStore.set(this.key, { priceWithoutTax: newPriceWithoutTax })
      }
    } else if (priceWithoutTax) {
      const newPriceWithTax = addTaxToPrice(
        +priceWithoutTax,
        +percentTaxRate
      ).toFixed(2)
      if (newPriceWithTax !== this.getPriceWithTax().value) {
        this.formStore.set(this.key, { priceWithTax: newPriceWithTax })
      }
    }
  }

  getPriceWithTax(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).priceWithTax,
      canEdit: true
    }
  }
  setPriceWithTax(priceWithTax: string | undefined): void {
    this.formStore.set(this.key, { priceWithTax })
    const taxRate = this.getPercentTaxRate().value
    if (taxRate) {
      const newPriceWithoutTax = removeTaxFromPrice(
        +priceWithTax,
        taxRate
      ).toFixed(2)
      if (newPriceWithoutTax !== this.getPriceWithoutTax().value) {
        this.formStore.set(this.key, { priceWithoutTax: newPriceWithoutTax })
      }
    }
  }

  getLaboratory(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).laboratory,
      canEdit: true
    }
  }
  setLaboratory(laboratory: string): void {
    this.formStore.set(this.key, { laboratory })
  }

  getLocation(): Field<string | undefined> {
    return {
      value: this.formStore.get(this.key).location,
      canEdit: true
    }
  }
  setLocation(location: string): void {
    this.formStore.set(this.key, { location })
  }

  getAvailableStock(): Field<string> {
    return {
      value: this.formStore.get(this.key).availableStock,
      canEdit: true
    }
  }
  setAvailableStock(availableStock: string): void {
    this.formStore.set(this.key, { availableStock })
  }

  getImages(): Array<string> {
    return this.images
  }

  getNewImages(): Field<Array<File>> {
    return {
      value: this.formStore.get(this.key).newImages,
      canEdit: true
    }
  }
  async setNewImages(newImages: Array<File>): Promise<void> {
    this.formStore.set(this.key, { newImages })
    for (const image of newImages) {
      const content = await getFileContent(image)
      this.images.push(content)
    }
  }

  getDescription(): Field<string> {
    return {
      value: this.formStore.get(this.key).description,
      canEdit: true
    }
  }

  setDescription(description: string): void {
    this.formStore.set(this.key, { description })
  }

  getInstructionsForUse(): Field<string> {
    return {
      value: this.formStore.get(this.key).instructionsForUse,
      canEdit: true
    }
  }

  setInstructionsForUse(instructionsForUse: string): void {
    this.formStore.set(this.key, { instructionsForUse })
  }

  getComposition(): Field<string> {
    return {
      value: this.formStore.get(this.key).composition,
      canEdit: true
    }
  }

  setComposition(composition: string): void {
    this.formStore.set(this.key, { composition })
  }

  getDto(): CreateProductDTO {
    const formValue = this.formStore.get(this.key)
    return {
      name: formValue.name,
      cip7: formValue.cip7,
      cip13: formValue.cip13,
      ean13: formValue.ean13,
      categoryUuid: formValue.categoryUuid,
      laboratory: formValue.laboratory,
      images: formValue.newImages,
      priceWithoutTax: formValue.priceWithoutTax,
      percentTaxRate: formValue.percentTaxRate,
      location: formValue.location,
      availableStock: formValue.availableStock,
      description: formValue.description,
      instructionsForUse: formValue.instructionsForUse,
      composition: formValue.composition
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const createProductVM = (key: string): CreateProductVM => {
  return new CreateProductVM(key)
}
