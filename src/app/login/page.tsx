import React from 'react'
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptionsData } from '@/lib/authOptions'

async function page () {
  const session = await getServerSession(authOptionsData)
  // if(session) redirect("/");
  return (
    <>
      <LoginForm/>
    </>
  )
}

export default page
