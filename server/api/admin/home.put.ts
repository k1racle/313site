export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeHomeContent(await readBody(event))
})
