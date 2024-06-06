import React from 'react'
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

import { getServerSession} from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

async function page() {
  const session = await getServerSession(authOptions);
  // if(session) redirect("/");
  return (
    <>
      <LoginForm/>
    </>
  )
}

export default page