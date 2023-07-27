import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    response.send('Criar user')
  })
}
