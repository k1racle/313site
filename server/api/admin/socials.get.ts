export default defineEventHandler((event) => {
  requireAdminSession(event)
  return readSocialsContent()
})
