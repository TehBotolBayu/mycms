import React from 'react'
import LazyLoad from '@/components/LazyLoad'


async function page () {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/1`, { cache: 'no-store' })
  const dataa = await data.json()

  return (
    <div className='mt-8 md:mt-12 md:mx-auto px-4 md:px-32 max-w-screen-xl w-full min-h-screen flex'>
      <div className=" w-full mx-1">
        <div className="font-bold text-black text-3xl mb-5 mt-16">
          For You
        </div>
        <div className='w-full border-b-2 mb-5'></div>
        <LazyLoad mode={''} querystring={''} filter={undefined} sort={''}/>
      </div>
      {/* <div className='w-1/3 hidden md:block'>
        <div className="font-semibold text-black text-xl mb-5 mt-16">
          Recommended
        </div>
        <div className='w-full border-b-2'></div>
      </div> */}
    </div>
  )
}

export default page
