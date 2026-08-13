export default defineEventHandler(async () => ({
  priceList: await readPriceList(),
}))
