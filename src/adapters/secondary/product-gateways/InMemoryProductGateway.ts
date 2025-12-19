import { Category } from '@core/entities/category'
import { Product } from '@core/entities/product'
import { isExistingImage, type ProductImage } from '@core/entities/productImage'
import { ProductDoesNotExistsError } from '@core/errors/ProductDoesNotExistsError'
import { ProductGateway } from '@core/gateways/productGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useCategoryStore } from '@store/categoryStore'
import { getFileContent } from '@utils/file'

export class InMemoryProductGateway implements ProductGateway {
  private products: Array<Product> = []
  private productsListItem: Array<ProductListItem> = []
  private categoryStore: any
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
    this.categoryStore = useCategoryStore()
  }

  async list(limit: number, offset: number): Promise<Array<ProductListItem>> {
    const res = this.productsListItem.slice(offset, offset + limit)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  private toListItem(product: Product): ProductListItem {
    return {
      uuid: product.uuid,
      name: product.name,
      ean13: product.ean13,
      laboratory: product.laboratory
        ? {
            uuid: product.laboratory.uuid,
            name: product.laboratory.name
          }
        : undefined,
      categories: product.categories.map((c) => ({
        uuid: c.uuid,
        name: c.name
      })),
      priceWithoutTax: product.priceWithoutTax,
      percentTaxRate: product.percentTaxRate,
      availableStock: product.availableStock,
      status: product.status,
      flags: product.flags,
      miniature: product.miniature,
      isMedicine: product.isMedicine
    }
  }

  async count(): Promise<number> {
    return Promise.resolve(this.products.length)
  }

  async batch(uuids: Array<UUID>): Promise<Array<Product>> {
    const res = this.products.filter((p) => uuids.includes(p.uuid))
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const images: Array<string> = []
    for (const image of dto.images || []) {
      images.push(await getFileContent(image))
    }
    const product: Product = {
      uuid: this.uuidGenerator.generate(),
      status: dto.status,
      categories: [],
      name: dto.name,
      cip7: dto.cip7,
      cip13: dto.cip13,
      ean13: dto.ean13,
      miniature: '',
      images,
      priceWithoutTax: dto.priceWithoutTax,
      percentTaxRate: dto.percentTaxRate,
      locations: dto.locations,
      availableStock: dto.availableStock,
      laboratory: dto.laboratory,
      description: dto.description,
      instructionsForUse: dto.instructionsForUse,
      composition: dto.composition,
      weight: dto.weight,
      flags: dto.flags,
      isMedicine: false
    }
    if (dto.maxQuantityForOrder) {
      product.maxQuantityForOrder = dto.maxQuantityForOrder
    }
    dto.categoryUuids.forEach((uuid) => {
      const category = this.categoryStore.getByUuid(uuid)
      if (category) {
        product.categories.push(category)
      }
    })
    this.products.push(product)
    this.productsListItem.push(this.toListItem(product))
    return Promise.resolve(product)
  }

  async edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    const index = this.products.findIndex((c) => c.uuid === uuid)
    if (dto.locations) {
      Object.assign(this.products[index].locations, dto.locations)
      delete dto.locations
    }
    if (dto.orderedImages) {
      const images: Array<string> = []
      for (const image of dto.orderedImages) {
        if (isExistingImage(image)) {
          const source = image.source
          if (source.type === 'existing') {
            images.push(source.url)
          }
        } else {
          const source = image.source
          if (source.type === 'new') {
            images.push(await getFileContent(source.file))
          }
        }
      }
      this.products[index].images = images
      delete dto.orderedImages
    }
    if (dto.categoryUuids) {
      this.products[index].categories = []
      dto.categoryUuids.forEach((uuid) => {
        const category = this.categoryStore.getByUuid(uuid)
        if (category) {
          this.products[index].categories.push(category)
        }
      })
      delete dto.categoryUuids
    }
    this.products[index] = Object.assign(this.products[index], dto)
    const listItemIndex = this.productsListItem.findIndex(
      (p) => p.uuid === uuid
    )
    if (listItemIndex >= 0) {
      this.productsListItem[listItemIndex] = this.toListItem(
        this.products[index]
      )
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.products[index])))
  }

  bulkEdit(dto: EditProductDTO, uuids: Array<UUID>): Promise<Array<Product>> {
    const promises = uuids.map((uuid) => this.edit(uuid, dto))
    return Promise.all(promises)
  }

  getByUuid(uuid: UUID): Promise<Product> {
    const res = this.products.find((p) => p.uuid === uuid)
    if (!res) throw new ProductDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getByCategoryUuid(
    limit: number,
    offset: number,
    categoryUuid: UUID
  ): Promise<Array<Product>> {
    return Promise.resolve(
      this.products
        .filter((p) => p.categories.some((c) => c.uuid === categoryUuid))
        .slice(offset, offset + limit)
    )
  }

  getByLaboratoryUuid(laboratoryUuid: UUID): Promise<Array<Product>> {
    return Promise.resolve(
      this.products.filter(
        (p) => p.laboratory && p.laboratory.uuid === laboratoryUuid
      )
    )
  }

  addProductsToCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    this.products.forEach((product) => {
      if (productUuids.includes(product.uuid)) {
        product.categories.push(category)
      }
    })
    this.productsListItem.forEach((listItem) => {
      if (productUuids.includes(listItem.uuid)) {
        listItem.categories.push({ uuid: category.uuid, name: category.name })
      }
    })
    return Promise.resolve(
      JSON.parse(
        JSON.stringify(
          this.products.filter((p) => productUuids.includes(p.uuid))
        )
      )
    )
  }

  removeProductsFromCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    this.products.forEach((product) => {
      if (productUuids.includes(product.uuid)) {
        product.categories = product.categories.filter(
          (c) => c.uuid !== category.uuid
        )
      }
    })
    // Update productsListItem array
    this.productsListItem.forEach((listItem) => {
      if (productUuids.includes(listItem.uuid)) {
        listItem.categories = listItem.categories.filter(
          (c) => c.uuid !== category.uuid
        )
      }
    })
    return Promise.resolve(
      JSON.parse(
        JSON.stringify(
          this.products.filter((p) => productUuids.includes(p.uuid))
        )
      )
    )
  }

  feedWith(...products: Array<Product>) {
    this.products = JSON.parse(JSON.stringify(products))
    this.productsListItem = products.map((p) => this.toListItem(p))
  }

  feedListItemsWith(...productsListItem: Array<ProductListItem>) {
    this.productsListItem = productsListItem
  }
}
