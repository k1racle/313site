export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody<{ visibility?: unknown }>(event)

  return {
    visibility: await writeNavigationVisibility(body?.visibility),
  }
})
