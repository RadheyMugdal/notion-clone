import * as z from "zod";

export const FormSchema = z.object({
  email: z.string().email({message:"Invalid email"}).describe('Email'),
  password: z.string().min(8).describe('Password'),
});