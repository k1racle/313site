import { defineComponent, h, resolveComponent, type PropType, type VNode } from 'vue'
import type { BlogTextMark, BlogTextNode } from '~~/shared/types/blog'

function renderMarkedText(text: string, marks: BlogTextMark[] = [], index = 0): VNode | string {
  const mark = marks[index]
  if (!mark) return text
  const child = renderMarkedText(text, marks, index + 1)
  if (mark.type === 'bold') return h('strong', child)
  if (mark.type === 'italic') return h('em', child)
  if (mark.type === 'link') {
    return h('a', {
      href: mark.attrs?.href,
      target: '_blank',
      rel: 'noopener noreferrer nofollow',
    }, child)
  }
  return child
}

export default defineComponent({
  name: 'BlogRichText',
  props: {
    node: { type: Object as PropType<BlogTextNode>, required: true },
  },
  setup(props) {
    const component = resolveComponent('BlogRichText')
    const renderChildren = () => props.node.content?.map((node, index) => h(component, { node, key: index })) || []
    return () => {
      const node = props.node
      if (node.type === 'text') return renderMarkedText(node.text || '', node.marks)
      if (node.type === 'hardBreak') return h('br')
      if (node.type === 'paragraph') return h('p', renderChildren())
      if (node.type === 'heading') return h(node.attrs?.level === 3 ? 'h3' : 'h2', renderChildren())
      if (node.type === 'bulletList') return h('ul', renderChildren())
      if (node.type === 'orderedList') return h('ol', renderChildren())
      if (node.type === 'listItem') return h('li', renderChildren())
      return h('div', renderChildren())
    }
  },
})
