import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { sessionsRoutes } from './routes/sessions'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(sessionsRoutes, {
  prefix: 'sessions',
})

export { app }
