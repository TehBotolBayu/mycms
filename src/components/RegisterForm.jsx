'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function RegisterForm () {
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [error, seterror] = useState('')

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      seterror('All fields are necessary')
      return
    }

    try {
      const resUser = await fetch('api/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      })

      const { user } = await resUser.json()
      if (user) {
        seterror('Email already registered')
        return
      }

      const username = name.replace(/\s+/g, '-') + '-' + Date.now()

      const res = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, username, email, password
        })
      })
      const data = await res.json()
      if (res.ok) {
        console.log(data)
        const form = e.target
        form.reset()
        router.push('/')
      } else {
        console.log('User registration failed')
        seterror('User registration failed')
      }
    } catch (error) {
      console.log('Error during registration: ', error)
      seterror('Error during registration')
    }

    seterror('')
  }

  return (
    <div className='grid place-items-center h-screen'>
        <div className='shadow-lg p-5 rounded-lg border-t-4 border-gray-400'>
            <h1 className='text-xl font-bold my-4'>Register</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <input onChange={e => { setname(e.target.value) }} type="text" placeholder='Full Name' />
                <input onChange={e => { setemail(e.target.value) }} type="text" placeholder='Email' />
                <input onChange={e => { setpassword(e.target.value) }} type="password" placeholder='Password' />
                <button className='bg-gray-600 text-white font-bold cursor-pointer px-6 py-2 '>Register</button>
                {
                    error &&
                <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 '>
                    {error}
                </div>
                }
                <Link href={'/'} className='text-sm mt-3 text-right'>
                    Already have an account ?
                    <span className='underline'>Login</span>
                </Link>
            </form>
        </div>
    </div>
  )
}

export default RegisterForm
