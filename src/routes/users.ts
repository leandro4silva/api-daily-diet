import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { hash } from 'bcrypt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUser = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = createUser.parse(request.body)

    const emailAlreadyExist = await knex('users')
      .select('*')
      .where('email', email)
      .first()

    if (emailAlreadyExist) {
      throw new Error('Esse email ja esta cadastrado')
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({
      id: randomUUID(),
      email,
      password: hashedPassword,
    })

    return reply.status(201).send()
  })
}
