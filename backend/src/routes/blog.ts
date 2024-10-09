import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const router = new Hono< {
    Bindings: {
        JWT_SECRETE: string
    }
    Variables: {
        prisma: PrismaClient;
        userid: string
    }
}>();

router.post('/', async (c) => {
    const prisma = c.get('prisma');
    const userid = c.get('userid');
    const body = await c.req.json(); 

    try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userid
            }
        })
        
        return c.json({id: post.id});
    }
    catch(e) {
        c.status(403);
        return c.json({message: "error"});
    }
})

router.put('/', async (c) => {
    const prisma = c.get('prisma');
    const userid = c.get('userid');
    const body = await c.req.json(); 

    try {
        const post = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })
        
        return c.json({message: "post updated"});
    }
    catch(e) {
        c.status(403);
        return c.json({message: "error"});
    }
})


router.get('/bulk', async (c) => {
    const prisma = c.get('prisma');

    try {
        const posts = await prisma.post.findMany({
    
            select : {
                title: true,
                content: true,
                authorId: true
            }
        });
        return c.json({posts: posts})

    }
    catch(e) {
        c.status(403);
        return c.json({message: "error"});
    }
})

router.get('/:id', async (c) => {
    const prisma = c.get('prisma');
    const id = c.req.param('id');

    try {
        const post = await prisma.post.findFirst({
            where: {
                id: id
            },
            select : {
                title: true,
                content: true,
                authorId: true
            }
        })

        return c.json({post})

    }
    catch(e) {
        c.status(403);
        return c.json({message: "error"});
    }
})
export default router;