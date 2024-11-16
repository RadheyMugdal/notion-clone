"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FormSchema } from '@/lib/types'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import Image from 'next/image'
import Logo from "../../../../public/cypresslogo.svg"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'
const Loginpage = () => {
    const router=useRouter()
    const [submitError, setSubmitError] = React.useState<string | null>(null)
    const form=useForm<z.infer<typeof FormSchema>>({
        mode:"onChange",
        resolver:zodResolver(FormSchema),
        defaultValues:{
            email:"",
            password:""
        }
    })
    const isLoading=form.formState.isSubmitting
    const onSubmit:SubmitHandler<z.infer<typeof FormSchema>>=async (formdata)=>{

    }
  return (
    <Form {...form}>
      <form  onChange={()=>{
        if(submitError){
          setSubmitError('')
        }
      }}  onSubmit={form.handleSubmit(onSubmit)} className=' w-full sm:justify-center sm:w-[400px] space-y-6 flex-col'>
        <Link href={"/"} className=' w-full flex justify-left items-center'  >
          <Image src={Logo} alt="Cypress logo" width={50} height={50} />
      <span className=' font-semibold dark:text-white text-4xl ml-2'>
        Cypress
      </span>
        </Link>
      <FormDescription className=' text-foreground/60'  >
          All-In-One Collaboration and Productivity Plateform
      </FormDescription>
      <FormField disabled={isLoading} control={form.control} name='email' render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type='email' placeholder='Email'{...field} />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
      >
      </FormField>
      <FormField disabled={isLoading} control={form.control} name='password' render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type='password' placeholder='Password'{...field} />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
      />
      {submitError && <FormMessage>{submitError}</FormMessage>}
      <Button type='submit' className=' w-full p-6 size-lg  'disabled={isLoading} >{!isLoading?'Login':<Loader/>}</Button>
      <span className=' self-container'>Dont have an account?
        <Link href={"/signup"} className=' text-primary'>Signup</Link>
      </span>
      </form>
    </Form>
  )
}

export default Loginpage
