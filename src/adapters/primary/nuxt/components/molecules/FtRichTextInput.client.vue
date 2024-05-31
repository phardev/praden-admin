<template lang="pug">
div
  div(v-if="editor")
    div.flex(v-if="!disabled")
      div.border.border-neutral-light.rounded-t-lg.p-2.inline-flex.items-center.gap-1
        UDropdown.h-10(
          mode="hover"
          :items="textTypeOptions"
          :popper="{ placement: 'bottom-start' }"
        )
          div.flex
            ft-button(
              variant="outline"
              icon="i-heroicons-chevron-down-20-solid"
              trailing
            ) {{ lastAction }}
        ft-button.h-10(
          v-for="option in options"
          :key="option.label"
          variant="outline"
          :disabled="!editor.can().chain().focus()[option.action](option.args).run()"
          @click="editor.chain().focus()[option.action](option.args).run()"
        )
          icon.icon-sm(:name="option.icon")
    TiptapEditorContent.border.border-neutral-light.rounded-b-lg.rounded-tr-lg(
      class="-mt-px relative"
      :editor="editor"
    )
</template>

<script setup>
import FtButton from '@adapters/primary/nuxt/components/atoms/FtButton.vue'

const model = defineModel({ type: String })

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const editor = useEditor({
  content: model.value,
  editable: !props.disabled,
  extensions: [TiptapStarterKit],
  editorProps: {
    attributes: {
      class: 'prose prose-sm m-5 focus:outline-none'
    }
  },
  onUpdate({ editor }) {
    model.value = editor.getHTML()
  }
})

const createTextTypeOption = (label, action, args = {}) => {
  return [
    {
      label: label,
      class: "{ 'is-active': editor.isActive(action, args) }",
      click: () => {
        lastAction.value = label
        const chain = editor.value.chain().focus()
        if (typeof chain[action] === 'function') {
          chain[action](args).run()
        }
      }
    }
  ]
}

const textTypeOptions = [
  createTextTypeOption('Normal', 'setParagraph'),
  createTextTypeOption('Titre 1', 'toggleHeading', { level: 1 }),
  createTextTypeOption('Titre 3', 'toggleHeading', { level: 3 }),
  createTextTypeOption('Titre 4', 'toggleHeading', { level: 4 }),
  createTextTypeOption('Titre 5', 'toggleHeading', { level: 5 }),
  createTextTypeOption('Titre 6', 'toggleHeading', { level: 6 })
]

const options = [
  {
    label: 'Bold',
    action: 'toggleBold',
    icon: 'material-symbols-light:format-bold'
  },
  {
    label: 'Italic',
    action: 'toggleItalic',
    icon: 'material-symbols-light:format-italic'
  },
  {
    label: 'BulletList',
    action: 'toggleBulletList',
    icon: 'material-symbols:format-list-bulleted'
  },
  {
    label: 'OrderedList',
    action: 'toggleOrderedList',
    icon: 'mingcute:list-ordered-line'
  }
]

const lastAction = ref(textTypeOptions[0][0].label)
</script>
