import fastify from 'fastify'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(usersRoutes, {
  prefix: '/users',
})

export { app }
