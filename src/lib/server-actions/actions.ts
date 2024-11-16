'use server'

import { z, ZodIntersection } from "zod";
import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData:FormData){
    const supabase=await createClient()
    const data={
        email:formData.get('email') as string,
        password:formData.get('password') as string
    }
    const {error} =await supabase.auth.signInWithPassword(data)
    if(error){
        redirect('/login')
    }
    revalidatePath('/')
    redirect('/')

}