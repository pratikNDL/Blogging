import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/extension';
import { signininput, signupinput } from '@pratikndl/common';

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
    const {success, data} = signupinput.safeParse(body);

    if(!success) {
      c.status(403);
      return c.json({message: "Improper Input"})
    }
  
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          name: data.name
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
    const {success, data} = signininput.safeParse(body);

    if(!success) {
      c.status(403);
      return c.json({message: "Improper Input"})
    }
    
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
        password: data.password
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