export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody<{ services?: unknown }>(event)

  return {
    services: await writeFeaturedServices(body?.services),
  }
})
