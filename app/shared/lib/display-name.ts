const protectedShortWords = [
  'а', 'в', 'во', 'да', 'до', 'за', 'и', 'из', 'к', 'ко', 'на', 'не', 'ни', 'но', 'о', 'об', 'от', 'по', 'с', 'со', 'у',
] as const

const shortWordPattern = new RegExp(
  `(^|[\\s\\(\\[\\{«„"'])(${protectedShortWords.join('|')})[ \\t]+(?=\\S)`,
  'giu',
)

export function protectPrepositions(text: string): string {
  return text.replace(shortWordPattern, '$1$2\u00A0')
}

export type DisplayNameSize = 'xl' | 'lg' | 'md' | 'sm'

export function getDisplayNameSize(text: string): DisplayNameSize {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  const words = text.trim().split(/\s+/).filter(Boolean)
  const longestWordLength = Math.max(0, ...words.map(word => word.length))
  const longestLineLength = Math.max(0, ...lines.map(line => line.length))

  if (longestWordLength <= 8 && longestLineLength <= 12) return 'xl'
  if (longestWordLength <= 12 && longestLineLength <= 18) return 'lg'
  if (longestWordLength <= 18 && longestLineLength <= 26) return 'md'
  return 'sm'
}
