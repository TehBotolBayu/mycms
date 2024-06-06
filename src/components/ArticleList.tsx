import React from 'react'
import ReadOnly from './ReadOnly'
import Link from 'next/link'

async function ArticleList() {
    const res = await import("../app/api/article/route");
    const data = await res.GET(null);
    const dataa = await data.json();
    console.log(dataa);

  return (
    <>
    {
        dataa.data.map((e, i) => 
          <>
          <Link 
          key={i}
          href={{
            pathname: `/read`,
            query: {
              id: e._id
            }
          }}
          className='text-lg font-bold cursor-pointer'>
            {e.title}
          </Link>
          <ReadOnly initialValue={e.content} />
          </>
        )
    }
    </>
  )
}

export default ArticleList