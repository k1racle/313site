<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Pilcrow, Redo2, Undo2 } from 'lucide-vue-next'
import type { BlogTextNode } from '~~/shared/types/blog'

const props = defineProps<{ modelValue: BlogTextNode }>()
const emit = defineEmits<{ 'update:modelValue': [value: BlogTextNode] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      blockquote: false,
      code: false,
      codeBlock: false,
      horizontalRule: false,
      strike: false,
      underline: false,
    }),
  ],
  editorProps: {
    attributes: {
      class: 'min-h-64 px-4 py-4 text-base leading-relaxed text-ink outline-none',
    },
  },
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getJSON() as BlogTextNode),
})

watch(() => props.modelValue, (value) => {
  if (!editor.value) return
  if (JSON.stringify(editor.value.getJSON()) !== JSON.stringify(value)) editor.value.commands.setContent(value, { emitUpdate: false })
}, { deep: true })

function setLink() {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href as string | undefined
  const url = window.prompt('Ссылка', previousUrl || 'https://')
  if (url === null) return
  if (!url.trim()) editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
  else editor.value.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
}

const controls = computed(() => [
  { label: 'Абзац', icon: Pilcrow, active: editor.value?.isActive('paragraph'), action: () => editor.value?.chain().focus().setParagraph().run() },
  { label: 'Заголовок 2', icon: Heading2, active: editor.value?.isActive('heading', { level: 2 }), action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: 'Заголовок 3', icon: Heading3, active: editor.value?.isActive('heading', { level: 3 }), action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run() },
  { label: 'Жирный', icon: Bold, active: editor.value?.isActive('bold'), action: () => editor.value?.chain().focus().toggleBold().run() },
  { label: 'Курсив', icon: Italic, active: editor.value?.isActive('italic'), action: () => editor.value?.chain().focus().toggleItalic().run() },
  { label: 'Маркированный список', icon: List, active: editor.value?.isActive('bulletList'), action: () => editor.value?.chain().focus().toggleBulletList().run() },
  { label: 'Нумерованный список', icon: ListOrdered, active: editor.value?.isActive('orderedList'), action: () => editor.value?.chain().focus().toggleOrderedList().run() },
])
</script>

<template>
  <div class="border border-ink/15 bg-page focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
    <div class="flex flex-wrap gap-1 border-b border-ink/10 bg-white p-2">
      <button
        v-for="control in controls"
        :key="control.label"
        type="button"
        class="grid size-9 place-items-center border text-ink transition hover:border-accent hover:text-accent"
        :class="control.active ? 'border-accent bg-accent text-white hover:text-white' : 'border-ink/10 bg-white'"
        :aria-label="control.label"
        :title="control.label"
        @click="control.action"
      >
        <component :is="control.icon" class="size-4" aria-hidden="true" />
      </button>
      <button type="button" class="grid size-9 place-items-center border border-ink/10 bg-white text-ink transition hover:border-accent hover:text-accent" aria-label="Добавить ссылку" title="Добавить ссылку" @click="setLink">
        <Link2 class="size-4" aria-hidden="true" />
      </button>
      <span class="mx-1 w-px bg-ink/10" aria-hidden="true" />
      <button type="button" class="grid size-9 place-items-center border border-ink/10 bg-white text-ink disabled:opacity-25" :disabled="!editor?.can().undo()" aria-label="Отменить" @click="editor?.chain().focus().undo().run()"><Undo2 class="size-4" /></button>
      <button type="button" class="grid size-9 place-items-center border border-ink/10 bg-white text-ink disabled:opacity-25" :disabled="!editor?.can().redo()" aria-label="Повторить" @click="editor?.chain().focus().redo().run()"><Redo2 class="size-4" /></button>
    </div>
    <EditorContent
      :editor="editor"
      class="[&_.ProseMirror_h2]:mt-7 [&_.ProseMirror_h2]:font-display [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-extrabold [&_.ProseMirror_h2]:uppercase [&_.ProseMirror_h3]:mt-6 [&_.ProseMirror_h3]:font-display [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-extrabold [&_.ProseMirror_h3]:uppercase [&_.ProseMirror_li]:my-1 [&_.ProseMirror_ol]:my-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_p]:my-3 [&_.ProseMirror_ul]:my-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6"
    />
  </div>
</template>
