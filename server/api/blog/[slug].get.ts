export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const post = await readPublishedBlogPost(slug)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
  return post
})
