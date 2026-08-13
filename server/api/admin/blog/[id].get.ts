export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const post = await readBlogPostById(getRouterParam(event, 'id') || '')
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
  return post
})
