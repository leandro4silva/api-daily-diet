import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exist'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: checkSessionIdExists },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals').select('*').where('userId', sessionId)

      reply.send({
        meals,
      })
    },
  )

  app.post(
    '/',
    { preHandler: checkSessionIdExists },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { sessionId } = request.cookies

      const createMeals = z.object({
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        date: z.string().default(new Date().toLocaleString('pt-BR')),
        diet: z.boolean(),
      })

      const { name, description, date, diet } = createMeals.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date,
        diet,
        userId: sessionId,
      })

      return reply.status(201).send()
    },
  )

  app.put('/:id', (request: FastifyRequest, reply: FastifyReply) => {})
}
