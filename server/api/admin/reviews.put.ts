export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeReviewsContent(await readBody(event))
})
