"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.createPostInput = exports.signininput = exports.signupinput = void 0;
const zod_1 = require("zod");
exports.signupinput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4),
    name: zod_1.z.string().optional()
});
exports.signininput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4)
});
exports.createPostInput = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
exports.updatePostInput = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
});
