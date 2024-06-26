'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function LoginForm () {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [error, seterror] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await signIn('credentials', {
        email, password, redirect: false
      })
      if (res!.error) {
        seterror('Invalid credentials')
        return
      }
      getSession().then((v: any) => {
        router.replace(v.user.username)
      })
      // //console.log(res);
    } catch (error) {
      //console.log(error)
    }
  }

  return (
    <div className='grid place-items-center h-screen'>
        <div className='shadow-lg p-5 rounded-lg border-t-4 border-gray-400'>
            <h1 className='text-xl font-bold my-4'>Enter the details</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <input onChange={e => { setemail(e.target.value) }} type="text" placeholder='Email' />
                <input onChange={e => { setpassword(e.target.value) }} type="password" placeholder='Password' />
                <button className='bg-gray-600 text-white font-bold cursor-pointer px-6 py-2 '>Login</button>
                {
                    error &&
                <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 '>
                    {error}
                </div>
                }
                <Link href={'/register/new'} className='text-sm mt-3 text-right'>
                    Don't have an account ?
                    <span className='underline'>Register</span>
                </Link>
            </form>
        </div>
    </div>
  )
}

export default LoginForm
