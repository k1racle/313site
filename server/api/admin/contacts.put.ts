export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeSiteContacts(await readBody(event))
})
