export default defineEventHandler(async () => ({
  services: await readFeaturedServices(),
}))
