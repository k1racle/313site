export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeSiteSettings(await readBody(event))
})
