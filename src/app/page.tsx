import React from 'react'
import LazyLoad from '@/components/LazyLoad'


async function page () {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/1`, { cache: 'no-store' })
  const dataa = await data.json()

  return (
    <div className='mt-8 md:my-32 md:mx-auto px-4 md:px-32 max-w-screen-xl w-full min-h-screen flex'>
      <div className="md:w-2/3 md:mr-6 w-full mx-1">
        <div className="font-semibold text-black text-xl mb-5 mt-16">
          For You
        </div>
        <div className='w-full border-b-2'></div>
        <LazyLoad mode={''} querystring={''}/>
      </div>
      <div className='w-1/3 hidden md:block'>
        <div className="font-semibold text-black text-xl mb-5 mt-16">
          Recommended
        </div>
        <div className='w-full border-b-2'></div>
      </div>
    </div>
  )
}

export default page
