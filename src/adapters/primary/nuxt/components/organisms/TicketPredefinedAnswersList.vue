<template lang="pug">
.space-y-6
  .flex.items-center.justify-between
    .space-y-1
      p.text-gray-500 {{ $t('support.ticketPredefinedAnswers.description') }}
    ft-button(@click="$emit('create')")
      template(#leading)
        icon(name="i-heroicons-plus")
      | {{ $t('support.ticketPredefinedAnswers.create') }}

  .space-y-4(v-if="!isLoading && answers.length > 0")
    UInput(
      v-model="searchQuery"
      :placeholder="$t('support.ticketPredefinedAnswers.search.placeholder')"
      icon="i-heroicons-magnifying-glass"
      size="lg"
      class="mb-4"
    )
      template(#trailing)
        UButton(
          v-show="searchQuery"
          color="gray"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          @click="clearSearch"
        )

  .space-y-1(v-if="isLoading")
    USkeleton.h-32(v-for="n in 3" :key="n")

  .grid.gap-4(v-else-if="filteredAnswers.length > 0")
    ticket-predefined-answer-card(
      v-for="answer in filteredAnswers"
      :key="answer.uuid"
      :answer="answer"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    )

  UCard.text-center.py-12(v-else-if="searchQuery && filteredAnswers.length === 0")
    .space-y-3
      icon.mx-auto.h-12.w-12.text-gray-400(name="i-heroicons-magnifying-glass")
      .space-y-1
        h3.text-lg.font-medium {{ $t('support.ticketPredefinedAnswers.search.noResults.title') }}
        p.text-gray-500 {{ $t('support.ticketPredefinedAnswers.search.noResults.description') }}

  UCard.text-center.py-12(v-else)
    .space-y-3
      icon.mx-auto.h-12.w-12.text-gray-400(name="i-heroicons-chat-bubble-left-right-20-solid")
      .space-y-1
        h3.text-lg.font-medium {{ $t('support.ticketPredefinedAnswers.empty.title') }}
        p.text-gray-500 {{ $t('support.ticketPredefinedAnswers.empty.description') }}
      ft-button(@click="$emit('create')")
        template(#leading)
          icon(name="i-heroicons-plus")
        | {{ $t('support.ticketPredefinedAnswers.create') }}
</template>

<script setup lang="ts">
import type { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'

const props = defineProps<{
  answers: Array<TicketPredefinedAnswer>
  isLoading: boolean
}>()

defineEmits<{
  create: []
  edit: [answer: TicketPredefinedAnswer]
  delete: [answer: TicketPredefinedAnswer]
}>()

const searchQuery = ref('')

const filteredAnswers = computed(() => {
  if (!searchQuery.value) {
    return props.answers
  }

  const query = searchQuery.value.toLowerCase()
  return props.answers.filter(
    (answer: TicketPredefinedAnswer) =>
      answer.title.toLowerCase().includes(query) ||
      answer.content.toLowerCase().includes(query)
  )
})

const clearSearch = () => {
  searchQuery.value = ''
}
</script>
