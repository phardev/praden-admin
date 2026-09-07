import {
  AssistanceRequestCategory,
  type AssistanceSubject,
  AssistanceSubjectType
} from '@core/entities/assistanceRequest'
import { getFileContent } from '@utils/file'
import { elodieDurand } from '@utils/testData/customers'
import { orderToPrepare1 } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'
import {
  type AssistanceFormContext,
  type AssistanceRequestFormVM,
  assistanceRequestFormVM,
  MAX_ATTACHMENT_SIZE_BYTES,
  MAX_ATTACHMENTS
} from './assistanceRequestFormVM'

describe('Assistance request form VM', () => {
  const key = 'assistance-panel'
  const orderPageSubject: AssistanceSubject = {
    type: AssistanceSubjectType.ORDER,
    label: `${orderToPrepare1.deliveryAddress.firstname} ${orderToPrepare1.deliveryAddress.lastname}`,
    uuid: orderToPrepare1.uuid,
    pageUrl: `/orders/${orderToPrepare1.uuid}`
  }
  const orderPageContext: AssistanceFormContext = {
    pageSubject: orderPageSubject,
    suggestedCategory: AssistanceRequestCategory.ORDER
  }
  const customerSubject: AssistanceSubject = {
    type: AssistanceSubjectType.CUSTOMER,
    label: `${elodieDurand.firstname} ${elodieDurand.lastname}`,
    uuid: elodieDurand.uuid,
    pageUrl: `/customers/get/${elodieDurand.uuid}`
  }
  const png = new File(['png-content'], 'capture.png', { type: 'image/png' })
  const pdf = new File(['pdf-content'], 'facture.pdf', {
    type: 'application/pdf'
  })
  let vm: AssistanceRequestFormVM

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Given the panel is opened from an order page', () => {
    beforeEach(() => {
      vm = assistanceRequestFormVM(key, orderPageContext)
    })

    it('should suggest the order category', () => {
      expect(vm.get('category')).toStrictEqual({
        value: AssistanceRequestCategory.ORDER,
        canEdit: true
      })
    })

    it('should prefill the order as subject', () => {
      expect(vm.get('subject')).toStrictEqual({
        value: orderPageSubject,
        canEdit: true
      })
    })

    it('should not need a subject', () => {
      expect(vm.needsSubject()).toBe(false)
    })

    describe('When the operator chooses the other category', () => {
      beforeEach(async () => {
        await vm.set('category', AssistanceRequestCategory.OTHER)
      })

      it('should drop the subject', () => {
        expect(vm.get('subject').value).toBeUndefined()
      })

      it('should not need a subject', () => {
        expect(vm.needsSubject()).toBe(false)
      })

      it('should have no subject type', () => {
        expect(vm.subjectType()).toBeUndefined()
      })
    })

    describe('When the operator chooses the delivery category', () => {
      beforeEach(async () => {
        await vm.set('category', AssistanceRequestCategory.DELIVERY)
      })

      it('should keep the order as subject', () => {
        expect(vm.get('subject').value).toStrictEqual(orderPageSubject)
      })
    })

    describe('When the operator chooses the product category', () => {
      beforeEach(async () => {
        await vm.set('category', AssistanceRequestCategory.PRODUCT)
      })

      it('should drop the order subject', () => {
        expect(vm.get('subject').value).toBeUndefined()
      })

      it('should need a subject', () => {
        expect(vm.needsSubject()).toBe(true)
      })

      it('should look for a product', () => {
        expect(vm.subjectType()).toBe(AssistanceSubjectType.PRODUCT)
      })

      describe('When the operator goes back to the order category', () => {
        it('should prefill the order from the page again', async () => {
          await vm.set('category', AssistanceRequestCategory.ORDER)
          expect(vm.get('subject').value).toStrictEqual(orderPageSubject)
        })
      })
    })

    describe('When the operator switches to a category with another subject type', () => {
      beforeEach(async () => {
        await vm.set('subjectQuery', 'dup')
        await vm.set('category', AssistanceRequestCategory.PRODUCT)
      })

      it('should reset the subject query', () => {
        expect(vm.get('subjectQuery').value).toBe('')
      })
    })

    describe('When the operator switches to a category with the same subject type', () => {
      beforeEach(async () => {
        await vm.set('subjectQuery', 'dup')
        await vm.set('category', AssistanceRequestCategory.DELIVERY)
      })

      it('should keep the subject query', () => {
        expect(vm.get('subjectQuery').value).toBe('dup')
      })
    })

    describe('When the operator wants to change the subject', () => {
      beforeEach(() => {
        vm.startChangingSubject()
      })

      it('should drop the subject so that a new one can be picked', () => {
        expect(vm.needsSubject()).toBe(true)
      })

      it('should still be changing the subject', () => {
        expect(vm.isChangingSubject()).toBe(true)
      })

      describe('When the operator re-selects the order category', () => {
        beforeEach(async () => {
          await vm.set('category', AssistanceRequestCategory.ORDER)
        })

        it('should not re-attach the page subject', () => {
          expect(vm.get('subject').value).toBeUndefined()
        })

        it('should still need a subject', () => {
          expect(vm.needsSubject()).toBe(true)
        })
      })
    })
  })

  describe('Given the panel is opened from any other page', () => {
    beforeEach(() => {
      vm = assistanceRequestFormVM(key, {})
    })

    it('should not be valid', () => {
      expect(vm.isValid()).toBe(false)
    })

    it('should have no category', () => {
      expect(vm.get('category')).toStrictEqual({
        value: undefined,
        canEdit: true
      })
    })

    it('should start with an empty description', () => {
      expect(vm.get('description')).toStrictEqual({ value: '', canEdit: true })
    })

    describe('When the operator picks a customer', () => {
      beforeEach(async () => {
        await vm.set('category', AssistanceRequestCategory.CUSTOMER)
        await vm.set('subject', customerSubject)
      })

      it('should store the picked subject', () => {
        expect(vm.get('subject').value).toStrictEqual(customerSubject)
      })

      it('should not need a subject anymore', () => {
        expect(vm.needsSubject()).toBe(false)
      })
    })

    describe('When the operator types a subject query', () => {
      it('should store the query', async () => {
        await vm.set('subjectQuery', 'jea')
        expect(vm.get('subjectQuery').value).toBe('jea')
      })
    })

    describe('When the operator fills a category and a description', () => {
      beforeEach(async () => {
        await vm.set('category', AssistanceRequestCategory.OTHER)
        await vm.set('description', '  La recherche est lente  ')
      })

      it('should be valid', () => {
        expect(vm.isValid()).toBe(true)
      })

      it('should prepare a trimmed dto without subject', () => {
        expect(vm.getDto()).toStrictEqual({
          category: AssistanceRequestCategory.OTHER,
          subject: undefined,
          description: 'La recherche est lente'
        })
      })
    })

    describe('When the operator fills a blank description', () => {
      it('should not be valid', async () => {
        await vm.set('category', AssistanceRequestCategory.OTHER)
        await vm.set('description', '   ')
        expect(vm.isValid()).toBe(false)
      })
    })
  })

  describe('Attachments', () => {
    beforeEach(() => {
      vm = assistanceRequestFormVM(key, orderPageContext)
    })

    it('should start without attachments', () => {
      expect(vm.getAttachments()).toStrictEqual([])
    })

    it('should start without attachment error', () => {
      expect(vm.getAttachmentError()).toBeUndefined()
    })

    describe('When the operator adds an image', () => {
      beforeEach(async () => {
        await vm.addAttachments([png])
      })

      it('should list the image with its preview', async () => {
        expect(vm.getAttachments()).toStrictEqual([
          {
            name: png.name,
            size: png.size,
            formattedSize: {
              key: 'assistance.size.bytes',
              params: { n: png.size }
            },
            previewUrl: await getFileContent(png)
          }
        ])
      })

      it('should expose the file to send', () => {
        expect(vm.getFiles()).toStrictEqual([png])
      })

      it('should keep the page subject in the dto', async () => {
        await vm.set('description', 'Étiquette bloquée')
        expect(vm.getDto()).toStrictEqual({
          category: AssistanceRequestCategory.ORDER,
          subject: orderPageSubject,
          description: 'Étiquette bloquée'
        })
      })

      describe('When the operator removes it', () => {
        it('should list no attachment', () => {
          vm.removeAttachment(0)
          expect(vm.getAttachments()).toStrictEqual([])
        })
      })
    })

    describe('When the operator adds more images than allowed', () => {
      const tooManyImages = Array.from(
        { length: MAX_ATTACHMENTS + 1 },
        (_, index) =>
          new File([`image-${index}`], `image-${index}.png`, {
            type: 'image/png'
          })
      )

      beforeEach(async () => {
        await vm.addAttachments(tooManyImages)
      })

      it('should report too many attachments', () => {
        expect(vm.getAttachmentError()).toBe('tooMany')
      })

      it('should add none of them', () => {
        expect(vm.getAttachments()).toStrictEqual([])
      })

      it('should stay valid once a description is set', async () => {
        await vm.set('description', 'Étiquette bloquée')
        expect(vm.isValid()).toBe(true)
      })
    })

    describe('When the operator adds a file that is not an image', () => {
      beforeEach(async () => {
        await vm.addAttachments([pdf])
      })

      it('should report a wrong type', () => {
        expect(vm.getAttachmentError()).toBe('notImage')
      })

      it('should add nothing', () => {
        expect(vm.getFiles()).toStrictEqual([])
      })
    })

    describe('When the operator adds an image that is too large', () => {
      const hugeImage = new File(
        [new Uint8Array(MAX_ATTACHMENT_SIZE_BYTES + 1)],
        'huge.png',
        { type: 'image/png' }
      )

      it('should report a too large attachment', async () => {
        await vm.addAttachments([hugeImage])
        expect(vm.getAttachmentError()).toBe('tooLarge')
      })
    })

    describe('When the operator adds a valid image after an error', () => {
      it('should clear the error', async () => {
        await vm.addAttachments([pdf])
        await vm.addAttachments([png])
        expect(vm.getAttachmentError()).toBeUndefined()
      })
    })

    describe('When the operator removes an attachment after an error', () => {
      it('should clear the error', async () => {
        await vm.addAttachments([png])
        await vm.addAttachments([pdf])
        vm.removeAttachment(0)
        expect(vm.getAttachmentError()).toBeUndefined()
      })
    })

    describe('When the operator edits a field after an error', () => {
      it('should clear the error', async () => {
        await vm.addAttachments([pdf])
        await vm.set('description', 'Étiquette bloquée')
        expect(vm.getAttachmentError()).toBeUndefined()
      })
    })
  })
})
