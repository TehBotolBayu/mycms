import React from 'react'
import Link from 'next/link';
import UserInfo from '@/components/UserInfo'
import ReadOnly from '@/components/ReadOnly';
import { Navbar, Footer } from "@/components";
import LatestBlogPosts from "./latest-blog-posts";
import { redirect } from 'next/navigation';

async function Profile({ params }:{
  params: {username:String}
}) {

  return (
    <>
    {
      (()=>{
        if(params.username == "result"){
          redirect('/')
        }else if (params.username == "register"){
          redirect('/register/new')
        }else{
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