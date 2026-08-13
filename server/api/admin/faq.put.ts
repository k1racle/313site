export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeFaqContent(await readBody(event))
})
