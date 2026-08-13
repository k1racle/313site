export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody<{ priceList?: unknown }>(event)

  return {
    priceList: await writePriceList(body?.priceList),
  }
})
