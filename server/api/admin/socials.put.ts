export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return writeSocialsContent(await readBody(event))
})
