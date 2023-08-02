import { FastifyReply, FastifyRequest } from 'fastify'

interface MealsParams {
  id: string
}

export async function checkSessionIdExists(
  request: FastifyRequest<{ Params: MealsParams }>,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
