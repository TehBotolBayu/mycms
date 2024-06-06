'use client'

import React, { useEffect } from 'react'
// import { getSession } from 'next-auth/react'
// 
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'

function Tes() {
    const {data:session, status} = useSession();
    // useEffect(()=> {
    //     (()=>{
    //         getToken().then(v => console.log(v))
    //     })()
    // }, [])
  return (
    <div>tes
        {
            (status === "loading") && <>Loading</>
        }
        {
            (()=>{
                console.log('gdg');
                
                console.log(session);
                return <></>
            })()
        }
        {
            (status === "unauthenticated") ? 
            <p>unauthenticated</p>:<p>autenticated</p>
        }
    </div>
  )
}

export default Tes