"use client"

import { cx, css } from '@emotion/css'
import Link from 'next/link';
import ReadOnly from './ReadOnly';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, redirect } from 'next/navigation';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { Session, getServerSession } from 'next-auth';
import { Icon, Toolbar } from '@/components/slate'
import Hero from "@/components/hero";
import Image from "next/image";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface User {
  email : string, 
  name : string, 
  password : string | undefined,
  userid : string,
  pictureUrl : string
}

function UserInfo({usernameparam}:{usernameparam:String}) {
    const [userData, setUserData] = useState<User>({
      email : '', 
      name : '', 
      password : '',
      userid : '',
      pictureUrl: ''
    })
    const [load, setload] = useState(true)
    const [loaduser, setloaduser] = useState(true)

    const router = useRouter();
    const [editUser, seteditUser] = useState(false)

    const { data: session, status, update } = useSession()
    
    let nameshow = useRef<string>();
    let emailshow = useRef();

    useEffect(() => {
      ( () => {
          fetch(`http://localhost:3000/api/userExists?username=${usernameparam}`).then((res) => {
            res.json().then((v) => {
              if(!v.user?.name){ 
                router.push('/users/notfound')
              } else {
                setloaduser(false)
                nameshow.current = v.user.name; emailshow.current = v.user.email;
                setUserData({
                  ...userData,
                  email: v.user.email,
                  name: v.user.name,
                  userid: v.user._id,
                  pictureUrl: v.user.pictureUrl
                })
                console.log(v.user)
              }
            })
          }).catch((e) => {
            console.log(e)
          })
      })()
    }, [])

    // useEffect(() => {
    //   (async () => {
    //     if(!userData.userid) return
    //     const resdata = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/user/${userData.userid}`, { cache: 'no-store' });
    //     const dataa = await resdata.json();
    //     setdata(dataa);
    //     setload(false);
    //   })()
    // }, [userData])

    const handleSignOut = (e:any) => {
        e.preventDefault();
        signOut(); 
    }

    // const deleteArticle = async (event:any, articleId:string) => {
    //     try {
    //       const filteredData = data!.data!.filter((item:any) => item._id != articleId);        
    //       setdata({...data,  data:filteredData}); 
    //       const resdata = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/${articleId}`, {
    //         method: 'DELETE'
    //       });
    //       const dataa = await resdata.json();
    //       console.log(dataa);  
    //       console.log(data)
    //     } catch (error) {
    //       console.log(error); 
    //     }
    // }

    const editArticle = (event:any, articleId:any) => {
      try {
        const savedata = data!.data!.filter((item:any) => item._id == articleId)[0];
        localStorage.setItem('dataArticle', JSON.stringify(savedata));
        // console.log(savedata);
        router.push('/draft')
      } catch (error) {
        console.log(error)
      }
    }

    const handleEdit = () => {
      seteditUser(p => !p);
    }

    const handleDelete = () => {
      console.log('delete');   
    }

    const renderList = () => {
      if(status=="loading"){
        return <>Loading Articles...</>
      } else {
        if(!session){
          return (
            <div className='container mx-auto px-8 h-[22rem] lg:px-48 my-32'>
              <ReadOnly userid={'-1'} userdata={userData}/>
            </div>
            )          
        }
        return (
          <div className='container mx-auto px-8 h-[22rem] lg:px-48 my-32'>
            <ReadOnly userid={session.user._id} userdata={userData}/>
          </div>
          )
      }
    }

    const [filepp, setfilepp] = useState<any>(null);
    const [preview, setPreview] = useState<any>(null);
    const handleChangePicture = (e:any) => {
      const file = e.target.files[0];
      setfilepp(file);
      const reader = new FileReader();
      reader.onloadend = () => {
          setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }


    const renderView = () => {
      if(loaduser){
        return (
          <></>
        )
      }else{
    return (
      <>

    <header className="mb-12">
      <div className="container mx-auto px-8 h-[22rem] lg:px-48 my-48 ">
        {
          (userData.pictureUrl == "" && nameshow.current) ?
            <div className='h-40 w-40 rounded-xl text-white bg-red-800 text-8xl flex justify-center items-center'>
              {nameshow.current[0].toUpperCase()}
            </div>
          :
            <Image
            width={1024}
            height={1024}
            alt="avatar"
            src={userData.pictureUrl}
            className="w-40 h-40 object-cover object-center rounded-xl"
            />
        }
        <div className="flex flex-col md:flex-row  mt-16 justify-between">
          <Typography variant="h5" className="text-3xl">
            {nameshow.current}
          </Typography>
          <div className="my-1 md:my-0">
            {
              (() => {
               if  (status == "loading"){
                  return <></>
                } else {
                  if (session?.user?._id == userData.userid) {
                    return (
                  <>
                    <Button color="gray" className='mx-0 mr-2 md:mx-2 ' onClick={handleSignOut}>Log Out</Button>
                    <Button color="gray" className='mx-0 md:mx-2' onClick={handleEdit}>Edit Profil</Button>
                  </>) } else {
                    return (
                      <><Button color="gray" className='mx-2'>follow</Button></>
                  )}
                }
              })()
            }
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 mt-3">
            <Typography className="!text-gray-900 font-bold">323</Typography>
            <Typography className="!text-gray-500 font-normal">
              Posts
            </Typography>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Typography className="!text-gray-900 font-bold">3.5k</Typography>
            <Typography className="!text-gray-500 font-normal">
              Followers
            </Typography>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Typography className="!text-gray-900 font-bold">260</Typography>
            <Typography className="!text-gray-500 font-normal">
              Following
            </Typography>
          </div>
        </div>
      </div>
    </header>
        {
          (editUser) && 
            <div className="w-full h-full min-w-screen min-h-screen bg-gray-500 bg-opacity-50 fixed top-0 left-0 flex justify-center items-center z-10">
              <Card color="white" shadow={false} className='relative p-10 py-4 shadow-md'>
              <Typography variant="h4" color="blue-gray">Edit your info</Typography>
              <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                  <div className='flex items-center'>
                    {
                      (preview)?
                      <Image
                      width={1024}
                      height={1024}
                      alt="avatar"
                      src={preview}
                      className="w-20 h-20 object-cover object-center rounded-xl"
                      />:
                      <Image
                  width={1024}
                  height={1024}
                  alt="avatar"
                  src={userData.pictureUrl}
                  className="w-20 h-20 object-cover object-center rounded-xl"
                  />
                  }
                    <div className="h-full ml-5">
                      <Typography variant="h6" color="blue-gray" className="mb-3">
                      Profile Picture
                      </Typography>
                      {/* <Button className="" color='black'  > */}
                      <label className="inline-block cursor-pointer rounded-lg bg-black text-white font-bold py-2 px-4 text-sm">
                        <input type="file" className='hidden' onChange={handleChangePicture}/>
                        CHANGE
                       </label>
                      {/* </Button> */}
                    </div>
                  </div>
                  <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Your Name
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="your name"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    value={userData.name}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        name: e.target.value,
                      })
                    }}
                  />
                  <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Your Email
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    value={userData.email}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        email: e.target.value,
                      })
                    }}
                  />
                </div>
                <Button className="mt-6" fullWidth onClick={(e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append('file', filepp);
                    let urlFile = userData.pictureUrl;
                    let username : string | String | undefined = nameshow.current;
                      fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/`, {
                        method: 'POST',
                        body: formData
                      }).then((res) => {
                        if(!res.ok){
                          throw new Error('Upload error')
                        }
                        return res.json();
                      }).then((datares) => {
                        urlFile =  datares.uploadFile.url;
                        console.log(datares)
                        console.log(urlFile);
                      }).then(() => {
                         if(userData.name != username) {
                           username = userData.name.replace(/\s+/g, "-")+'-'+Date.now();
                         } else {
                          username = usernameparam
                         }
                        fetch('api/edit', {
                          method: 'PUT',
                          headers: {
                            'Content-Type':'application/json'
                          },
                          body: JSON.stringify({
                              ...userData,
                              pictureUrl:urlFile,
                              username,
                          })
                        })
                      })
                  .then(res => {
                    update({ ...session, user: {
                      email: userData.email,
                      name: userData.name,
                      username: username,
                      _id: userData.userid,
                      pictureUrl: userData.pictureUrl
                    }})
                    setUserData({
                      email : '', 
                      name : '', 
                      password : '',
                      userid : '',
                      pictureUrl: urlFile               
                    })
                    return res.json()
                  })
                  .then(v => console.log(v))
                  .then(() => {
                      localStorage.setItem('mycms_username', username)
                      router.push('/'+username)
                  })
                  .catch(e => console.log(e));
                }}>
                  Edit
                </Button>
                <Button className="mt-6" fullWidth color='white' onClick={() => seteditUser(false)}>
                  Cancel
                </Button>
              </form>
              </Card>
            </div>
        }
        <div>
        {
          (status != "loading")&&renderList()
        }
        </div>
      </>
    )
      }
    }

    return (
      <>
      {
        renderView()
      }
      </>
    )
}

export default UserInfo