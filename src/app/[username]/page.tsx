import React from 'react'
import Link from 'next/link'
import UserInfo from '@/components/UserInfo'
import ReadOnly from '@/components/ReadOnly'
import { redirect } from 'next/navigation'

async function Profile ({ params }: {
  params: { username: string }
}) {
  return (
    <>
    {
      (() => {
        if (params.username == 'result') {
          redirect('/')
        } else if (params.username == 'register') {
          redirect('/register/new')
        } else {
          return (
            <UserInfo usernameparam={params.username}/>
          )
        }
      })()
    }
    </>
  )
}

export default Profile
