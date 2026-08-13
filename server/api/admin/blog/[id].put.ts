export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeBlogPost(await readBody(event), getRouterParam(event, 'id') || '')
})
