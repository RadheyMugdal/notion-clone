import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(req:NextRequest){
    let supabaseResponse =NextResponse.next({
        request:req
    })

    const supabase=createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies:{
                getAll(){
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet){
                    cookiesToSet.forEach(({name,value,options})=>{
                        req.cookies.set(name,value)
                    })
                    supabaseResponse=NextResponse.next({
                        request:req
                    })
                    cookiesToSet.forEach(({name,value,options})=>{
                        supabaseResponse.cookies.set(name,value,options)
                    })
                }
            }
        }
    )
    const {data:{user}}=await supabase.auth.getUser()

    if(!user && !req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/signup')){
        const url=req.nextUrl.clone()
        url.pathname='/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse

}