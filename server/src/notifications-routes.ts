import WebPush from 'web-push';
import { FastifyInstance } from "fastify";
import { z } from 'zod';

// Generate keys
// console.log(WebPush.generateVAPIDKeys())

if(!process.env.PUSH_MANAGER_API_PUBLIC_KEY || !process.env.PUSH_MANAGER_API_PRIVATE_KEY)
  throw new Error("You must set PUSH_MANAGER_API_PUBLIC_KEY and PUSH_MANAGER_API_PRIVATE_KEY")

const publicKey = process.env.PUSH_MANAGER_API_PUBLIC_KEY;
const privateKey = process.env.PUSH_MANAGER_API_PRIVATE_KEY;

WebPush.setVapidDetails(
  'http://localhost:3333',
  publicKey,
  privateKey
)

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey
    }
  })

  app.post('/push/register', (req, rep) => {
    // Get user subscription
    // console.log(req.body);

    return rep.status(201).send()
  })

  app.post('/push/send', async (req, rep) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(req.body);

    setTimeout(() => {
      WebPush.sendNotification(subscription, "Hello from Server!")
    }, 5000)

    return rep.status(201).send()
  })
}