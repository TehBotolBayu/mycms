import React from 'react'
import ReadArticle from '@/components/ReadArticle'
import ReadOnly from '@/components/ReadOnly'
import LazyLoad from '@/components/LazyLoad'
async function page ({ params }: {
  params: { search: string }
}) {
  return (
    <div className='my-14 md:my-32 md:mx-auto px-10 max-w-screen-xl w-full min-h-screen'>
      <div className="font-semibold text-black text-3xl mb-5">
        Found result
      </div>
      <div className='w-full border-b-2'></div>
        <LazyLoad mode="search" querystring={params.search}/>
    </div>
  )
}

export default page
