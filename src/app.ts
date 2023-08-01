import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { sessionsRoutes } from './routes/sessions'
import { mealsRoutes } from './routes/meals'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(sessionsRoutes, {
  prefix: '/sessions',
})

app.register(mealsRoutes, {
  prefix: '/meals',
})

export { app }
