import React from 'react'
import ReadArticle from '@/components/ReadArticle'
import ReadOnly from '@/components/ReadOnly';
async function page({ params }:{
    params: {search:String}
}) { 

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/search`, { 
    method: 'POST',
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
        search: params.search.replace(/%20/g, ' ')
    }),
    cache: 'no-store' 
  });
  const dataa = await data.json();

  return (
    <div className='my-14 md:my-32 md:mx-auto px-10 max-w-screen-xl w-full min-h-screen'>
      <div className="font-semibold text-black text-3xl mb-5">
        Found {dataa.data.length} result
      </div>
      <div className='w-full border-b-2'></div>
        <ReadOnly datacontent={dataa.data}/>

    </div>
  )
}

export default page