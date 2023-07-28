import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { compare } from 'bcrypt'

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createSession = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = createSession.parse(request.body)

    const user = await knex('users').select('*').where('email', email).first()

    if (!user) {
      throw new Error('Usuario e/ou senha incorretos!')
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new Error('Usuario e/ou senha incorretos!')
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = user.id
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      })
    }

    return reply.status(201).send()
  })
}
