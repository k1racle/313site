export default defineEventHandler((event) => ({
  authenticated: hasAdminSession(event),
}))
