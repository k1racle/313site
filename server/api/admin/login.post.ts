interface AdminLoginBody {
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<AdminLoginBody>(event)
  const password = typeof body?.password === 'string' ? body.password : ''
  const config = useRuntimeConfig(event)

  if (!password || !isValidAdminPassword(password, config.adminPassword)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный пароль',
    })
  }

  createAdminSession(event)

  return { authenticated: true }
})
