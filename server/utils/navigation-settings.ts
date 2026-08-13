import {
  createEmptyNavigationVisibility,
  publicNavigationPaths,
  type NavigationVisibility,
} from '~~/shared/types/navigation'

function normalizeVisibility(value: unknown): NavigationVisibility {
  const visibility = createEmptyNavigationVisibility()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return visibility

  for (const path of publicNavigationPaths) {
    const savedValue = (value as Record<string, unknown>)[path]
    if (typeof savedValue === 'boolean') visibility[path] = savedValue
  }
  return visibility
}

export async function readNavigationVisibility() {
  const visibility = createEmptyNavigationVisibility()
  const items = await prisma.navigationItem.findMany()
  for (const item of items) {
    const path = item.path as typeof publicNavigationPaths[number]
    if (publicNavigationPaths.includes(path)) visibility[path] = item.visible
  }
  return visibility
}

export async function writeNavigationVisibility(value: unknown) {
  const visibility = normalizeVisibility(value)
  await prisma.$transaction(publicNavigationPaths.map(path => prisma.navigationItem.upsert({
    where: { path },
    update: { visible: visibility[path] },
    create: { path, visible: visibility[path] },
  })))
  return visibility
}
