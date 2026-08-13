export default defineEventHandler((event) => {
  requireAdminSession(event)
  return deleteBlogPost(getRouterParam(event, 'id') || '')
})
