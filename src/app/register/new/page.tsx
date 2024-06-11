import React from 'react'
import RegisterForm from '@/components/RegisterForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptionsData } from '@/lib/authOptions'

async function Register () {
  const session = await getServerSession(authOptionsData)
  // if(session) redirect("/profile");
  return (
    <div>
        <RegisterForm></RegisterForm>
    </div>
  )
}

export default Register
