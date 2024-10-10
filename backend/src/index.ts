import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate  } from '@prisma/extension-accelerate';
import { verify, sign } from 'hono/jwt';
import userRouter from './routes/user'
import blogRouter from './routes/blog'

type ExtendedPrismaClient = PrismaClient;

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRETE: string,
  },
  Variables: {
    prisma: PrismaClient;
    userid: string
  }
}>();

app.use('*', async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  //@ts-ignore
  c.set('prisma', prisma );
  await next();
})



app.use('/api/v1/blog/*', async(c, next) => {
  const authHeader = c.req.header('authorization');

  if(!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith("Bearer ")) {
    c.status(403);
    return c.json({message: 'Invalid Auth'});
  }

  const token = authHeader.split(' ')[1];
  try {
    const valid = await verify(token, c.env.JWT_SECRETE)
    c.set('userid', valid.id as string);
    await next();
  }
  catch(e) {
    c.status(403)
    return c.json({
      message: "Invaild Tokken"
    })
  }
})

app.route('api/v1/user/', userRouter);
app.route('api/v1/blog/', blogRouter);


export default app;
