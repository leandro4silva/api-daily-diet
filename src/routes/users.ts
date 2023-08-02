import { FastifyInstance, FastifyReply } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { hash } from 'bcrypt'
import { FastifyRequest } from 'fastify/types/request'

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

  app.get('/summary', async (request: FastifyRequest, replay: FastifyReply) => {
    const { sessionId } = request.cookies

    const allMeals = await knex('meals').where('userId', sessionId)

    const inDiet = await knex('meals')
      .count('id', { as: 'in' })
      .where('userId', sessionId)
      .andWhere('diet', true)
      .first()

    const outDiet = await knex('meals')
      .count('id', { as: 'out' })
      .where('userId', sessionId)
      .andWhere('diet', false)
      .first()

    let accountant = 0

    const sequence = allMeals.reduce((quantity, meal) => {
      if (meal.diet) {
        accountant++
        return Math.max(quantity, accountant)
      } else {
        accountant = 0
        return quantity
      }
    }, 0)

    return replay.send({
      totalMeals: allMeals.length,
      totalInDiet: inDiet?.in,
      totalOutDiet: outDiet?.out,
      sequenceInDiet: sequence,
    })
  })
}
