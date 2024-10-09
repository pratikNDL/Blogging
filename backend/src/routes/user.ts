import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/extension';

const router = new Hono< {
    Bindings: {
        JWT_SECRETE: string
    }
    Variables: {
        prisma: PrismaClient,
        userid: string
    }
}>();

router.post('/signup', async (c) => {
	
    const prisma = c.get('prisma');
    const body = await c.req.json();
  
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
        }
      })
  
      const token = await sign({id: user.id}, c.env.JWT_SECRETE);
      return c.json({token})
    }
    catch(e) {
      c.status(403)
      return c.json({
        message: "something went wrong"
      })
    }
  })
  
router.post('/signin', async (c) => {
    const prisma = c.get('prisma');
    const body = await c.req.json();
    
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password
      }
    })
    
    if(!user) {
      c.status(403)
      return c.json({
        message: "something went wrong"
      })
    }
  
    const token = await sign({id: user.id}, c.env.JWT_SECRETE);
    return c.json({token})
})

  export default router;