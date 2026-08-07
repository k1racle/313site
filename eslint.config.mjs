// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'app.js',
      'app.js.backup.*',
      'public/legacy/**',
      'server.js',
    ],
  },
)
