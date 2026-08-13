export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody<{ status?: unknown }>(event)
  return updateBlogPostStatus(getRouterParam(event, 'id') || '', body.status)
})
