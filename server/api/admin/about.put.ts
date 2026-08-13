export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeAboutContent(await readBody(event))
})
