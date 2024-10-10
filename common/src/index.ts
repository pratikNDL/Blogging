import { z } from "zod";

export const signupinput = z.object({
    email: z.string().email(),
    password: z.string().min(4),
    name: z.string().optional()
})
export type SignUpType = z.infer<typeof signininput>

export const signininput = z.object({
    email: z.string().email(),
    password: z.string().min(4)
})
export type SignInType = z.infer<typeof signininput>

export const createPostInput = z.object({
    title: z.string(),
    content : z.string()
})
export type createPostInput = z.infer<typeof createPostInput>

export const updatePostInput = z.object({
    title: z.string().optional(),
    content : z.string().optional(),
})
export type UpdatePostInput = z.infer<typeof updatePostInput>