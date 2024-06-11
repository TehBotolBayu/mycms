import React from 'react'
import ReadArticle from '@/components/ReadArticle'
import { redirect } from 'next/navigation'

async function page ({ params }: {
  params: { titleid: string }
}) {
  console.log(params.titleid)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/read/${params.titleid}`, { cache: 'no-store' })
  const contentData = await res.json()
  console.log(contentData)
  console.log('id: ', contentData.data[0].author)

  const resUser = await fetch(`http://localhost:3000/api/user?userid=${contentData.data[0].author}`, { cache: 'no-store' })
  const userData = await resUser.json()
  console.log('ini user data '); console.log(userData)

  return (
    <>
      <ReadArticle contentData={contentData.data[0]} userData={userData}/>
    </>
  )
}

export default page
