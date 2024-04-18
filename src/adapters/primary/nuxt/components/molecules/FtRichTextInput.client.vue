<template lang="pug">
div
  div(v-if="editor")
    div.flex
      div.border.border-default.rounded-t-lg.p-2.inline-flex.items-center.gap-1
        UDropdown.h-10(
          mode="hover"
          :items="textTypeOptions"
          :popper="{ placement: 'bottom-start' }"
        )
          ft-button.button-default(
            trailing-icon="i-heroicons-chevron-down-20-solid"
          ) {{ lastAction }}
        ft-button.button-default.h-10(
          v-for="option in options"
          :key="option.label"
          :class="['button-default', { 'is-active': editor.isActive(option.action, option.args) }]"
          :disabled="!editor.can().chain().focus()[option.action](option.args).run()"
          @click="editor.chain().focus()[option.action](option.args).run()"
        )
          icon.icon-sm(:name="option.icon")
    TiptapEditorContent.border.border-default.rounded-b-lg.rounded-tr-lg(
      class="-mt-px relative"
      :editor="editor"
    )
</template>

<script setup>
const editor = useEditor({
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [TiptapStarterKit],
  editorProps: {
    attributes: {
      class: 'prose prose-sm m-5 focus:outline-none'
    }
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
