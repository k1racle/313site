export default defineEventHandler((event) => {
  requireAdminSession(event)
  return readBody(event).then(body => writeBlogPost(body))
})
