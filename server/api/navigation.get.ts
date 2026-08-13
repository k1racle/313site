export default defineEventHandler(async () => ({
  visibility: await readNavigationVisibility(),
}))
