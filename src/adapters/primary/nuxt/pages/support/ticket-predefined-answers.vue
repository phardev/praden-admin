<template lang="pug">
.section
  .mb-8
    h1.text-page-title {{ $t('support.ticketPredefinedAnswers.title') }}

  ticket-predefined-answers-list(
    :answers="ticketPredefinedAnswersVM.answers"
    :is-loading="ticketPredefinedAnswersVM.isLoading"
    @create="openCreateModal"
    @edit="openEditModal"
    @delete="openDeleteModal"
  )

  ticket-predefined-answer-form-modal(
    v-model:is-open="isFormModalOpen"
    :answer="selectedAnswer"
    @close="closeFormModal"
    @submit="handleFormSubmit"
  )

  ticket-predefined-answer-delete-modal(
    v-model:is-open="isDeleteModalOpen"
    :answer="selectedAnswer"
    :is-deleting="isDeleting"
    @close="closeDeleteModal"
    @confirm="handleDelete"
  )
</template>

<script setup lang="ts">
import { getTicketPredefinedAnswersVM } from '@adapters/primary/view-models/support/ticket-predefined-answers/ticketPredefinedAnswersVM'
import { createTicketPredefinedAnswer } from '@core/usecases/support/ticket-predefined-answers/createTicketPredefinedAnswer'
import { deleteTicketPredefinedAnswer } from '@core/usecases/support/ticket-predefined-answers/deleteTicketPredefinedAnswer'
import { listTicketPredefinedAnswers } from '@core/usecases/support/ticket-predefined-answers/listTicketPredefinedAnswers'
import { updateTicketPredefinedAnswer } from '@core/usecases/support/ticket-predefined-answers/updateTicketPredefinedAnswer'
import { useTicketPredefinedAnswerGateway } from '../../../../../../gateways/ticketPredefinedAnswerGateway'

definePageMeta({ layout: 'main' })

const ticketPredefinedAnswerGateway = useTicketPredefinedAnswerGateway()
const ticketPredefinedAnswersVM = computed(() => getTicketPredefinedAnswersVM())

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedAnswer = ref<any>()
const isDeleting = ref(false)

const openCreateModal = () => {
  selectedAnswer.value = undefined
  isFormModalOpen.value = true
}

const openEditModal = (answer: any) => {
  selectedAnswer.value = answer
  isFormModalOpen.value = true
}

const openDeleteModal = (answer: any) => {
  selectedAnswer.value = answer
  isDeleteModalOpen.value = true
}

const closeFormModal = () => {
  isFormModalOpen.value = false
  selectedAnswer.value = undefined
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedAnswer.value = undefined
}

const handleFormSubmit = async (data: any) => {
  try {
    if (selectedAnswer.value) {
      await updateTicketPredefinedAnswer(
        selectedAnswer.value.uuid,
        data,
        ticketPredefinedAnswerGateway
      )
    } else {
      await createTicketPredefinedAnswer(data, ticketPredefinedAnswerGateway)
    }
    closeFormModal()
  } catch (error) {
    console.error('Error saving ticket predefined answer:', error)
  }
}

const handleDelete = async () => {
  if (!selectedAnswer.value) return

  try {
    isDeleting.value = true
    await deleteTicketPredefinedAnswer(
      selectedAnswer.value.uuid,
      ticketPredefinedAnswerGateway
    )
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting ticket predefined answer:', error)
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  listTicketPredefinedAnswers(ticketPredefinedAnswerGateway)
})
</script>
