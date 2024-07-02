'use client'

import { cx, css } from '@emotion/css'
import Link from 'next/link'
import ReadOnly from './ReadOnly'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, redirect } from 'next/navigation'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { Session, getServerSession } from 'next-auth'
import { Icon, Toolbar } from '@/components/slate'
import Hero from '@/components/hero'
import Image from 'next/image'
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Textarea
} from '@material-tailwind/react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { ToastContainer, toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { type User } from '@/types/User'

function UserInfo ({ usernameparam }: { usernameparam: string }) {
  const [editload, seteditload] = useState('false')
  const [userData, setUserData] = useState<User>({
    email: '',
    name: '',
    password: '',
    userid: '',
    pictureUrl: '',
    coverUrl: '',
    about: ''
  })
  const [load, setload] = useState(true)
  const [loaduser, setloaduser] = useState(true)

  const router = useRouter()
  const [editUser, seteditUser] = useState(false)

  const { data: session, status, update } : {data:any, status:any, update:any} = useSession()

  const nameshow = useRef<string>()
  const emailshow = useRef()

  // useEffect(() => { console.log('ini sesionnya'); console.log(session) }, [session])
  // useEffect(() => { console.log('ini nama'); console.log(userData.name) }, [userData])

  useEffect(() => {
    (() => {
      fetch(`/api/userExists?username=${usernameparam}`).then((res) => {
        res.json().then((v) => {
          if (!v.user?.name) {
            router.push('/users/notfound')
          } else {
            setloaduser(false)
            nameshow.current = v.user.name; emailshow.current = v.user.email
            setUserData({
              ...userData,
              email: v.user.email,
              name: v.user.name,
              userid: v.user._id,
              pictureUrl: v.user.pictureUrl,
              coverUrl: v.user.coverUrl,
              about: v.user.about
            })
            //console.log(v.user)
          }
        })
      }).catch((e) => {
        //console.log(e)
      })
    })()
  }, [])

  const handleSignOut = (e: any) => {
    e.preventDefault()
    signOut()
  }

  const handleEdit = () => {
    seteditUser(p => !p)
  }


  const renderList = () => {
    if (status == 'loading') {
      return <>Loading Articles...</>
    } else {
      if (!session) {
        return (
            <div className='container mx-auto h-[22rem] my-2'>
              <ReadOnly userid={'-1'} userdata={userData} token={undefined}/>
            </div>
        )
      }
      return (
          <div className='container mx-auto h-[22rem] my-2'>
            <ReadOnly userid={session.user._id} userdata={userData} token={session.user.token}/>
          </div>
      )
    }
  }

  const [filepp, setfilepp] = useState<any>(null)
  const [preview, setPreview] = useState<any>(null)
  const handleChangePicture = (e: any) => {
    const file = e.target.files[0]
    setfilepp(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }
  const [filecc, setfilecc] = useState<any>(null)
  const [previewcc, setPreviewcc] = useState<any>(null)

  const handleChangeCoverPicture = (e: any) => {
    seteditload("true");
    const file = e.target.files[0]
    setfilecc(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewcc(reader.result)
    }
    reader.readAsDataURL(file)
    console.log(filecc);
  }

  useEffect(()=>{
    (()=>{
      let urlFile:string;
      const formData = new FormData();
      formData.append("file", filecc);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/`, {
        method: "POST",
        body: formData,
      })
        .then(async (res) => {
          if (filecc) {
            if (!res.ok) {
              throw new Error("Upload error");
            }
            return await res.json();
          }
        })
        .then((datares) => {
          urlFile = datares.uploadFile.url;
        })
        .then(() => {
          return fetch("api/edit", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...userData,
              coverUrl: urlFile
            }),
          });
        })
        .then((res) => {
          if(res.ok){
            seteditload("false");
          } else {
          seteditload("failed");
          }
        })
        .catch(() => {
          seteditload("failed");
        })
    })()
  }, [filecc])

  const toastId = useRef<any>(null)

  const notifyLoad = () => toastId.current = toast(
      <div className='flex items-center'><img src="spinner.svg" alt="" className='w-12' /><span className='mr-2'>Loading</span></div>, {
        position: 'bottom-center',
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Zoom
      })
  const notifyResult = () => {
    toast.update(toastId.current, {
      render: <div className='flex items-center'><span className='mr-2'>Upload Success</span></div>,
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom
    })
  }
  const notifyError = () => {
    toast.update(toastId.current, {
      render: <div className='flex items-center text-red-400'><span className='mr-2'>Upload Failed</span></div>,
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom
    })
  }

  useEffect(() => {
    if (editload == 'true') { notifyLoad() } else if (editload == 'false') notifyResult()
    else if (editload == 'failed') notifyError()
  }, [editload])

  const renderView = () => {
    if (loaduser) {
      return (
          <></>
      )
    } else {
      return (
        <>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <section className="relative pt-40 pb-24 lg:px-40">
            {(previewcc) ? 
              <img
                src={previewcc}
                alt="cover-image"
                className={`w-full absolute top-0 left-0 z-0 h-60 lg:h-80 object-cover object-center
                 ${(session?.user?._id == userData.userid)?'hover:brightness-50 cursor-pointer':''} transition-all ease-in duration-100 one`}
              />
             : 
              <img
                src={
                  userData.coverUrl ||
                  "https://pagedone.io/asset/uploads/1705473378.png"
                }
                alt="cover-image"
                className={`w-full absolute top-0 left-0 z-0 h-60 lg:h-80 object-cover object-center
                ${(session?.user?._id == userData.userid)?'hover:brightness-50 cursor-pointer':''} transition-all ease-in duration-100 one`}
              />
            }
            {
              (session?.user?._id == userData.userid) &&
              <label
                className="
              cursor-pointer invisible w-full absolute top-0 left-0 z-0 h-60 lg:h-80 flex flex-col items-center justify-center two"
              >
                <input
                  type="file"
                  className="hidden"
                  onChange={handleChangeCoverPicture}
                />
                <img src="camera.png" alt="" className="w-10" />
                <p className="text-white">Change Cover</p>
              </label>
            }
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:translate-y-20">
              <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                {userData.pictureUrl == "" && nameshow.current ? (
                  <div className="text-white bg-red-800 text-8xl flex justify-center items-center border-4 border-solid border-white rounded-full w-40 h-40">
                    {nameshow.current[0].toUpperCase()}
                  </div>
                ) : (
                  <img
                    src={userData.pictureUrl}
                    alt="user-avatar-image"
                    className="border-4 border-solid border-white rounded-full w-40 h-40"
                  />
                )}
              </div>
              <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
                <div className="block">
                  <h3 className="font-manrope font-bold text-4xl text-gray-900 mb-1">
                    {nameshow.current}
                  </h3>
                </div>
              </div>
              {(() => {
                if (status == "loading") {
                  return <></>;
                } else {
                  if (session?.user?._id == userData.userid) {
                    return (
                      <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={handleEdit}
                            className="py-3.5 px-5 rounded-full bg-gray-800 text-white font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-black-800"
                          >
                            Edit Profile
                          </button>
                          <button
                            className="py-3.5 px-5 rounded-full bg-indigo-50 text-gray-800 font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100"
                            onClick={handleSignOut}
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
                        <div className="flex items-center gap-4">
                          <button className="py-3.5 px-5 rounded-full bg-gray-800 text-white font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-gray-800">
                            FOLLOW
                          </button>
                        </div>
                      </div>
                    );
                  }
                }
              })()}

              {/* User About */}
              <p className="my-8 lg:my-12 lg:text-xl text-center lg:text-left">
                {userData.about}
              </p>
              <div className="font-bold text-black text-3xl mb-5 w-full">
                Post
              </div>
              <div className="border-b-2 text-center mb-5 w-full"></div>
              <div>{status != "loading" && renderList()}</div>
            </div>
          </section>

          {/* Edit form */}
          {
            <div
              className={`transition-all ease-linear duration-3000 w-full h-full min-w-screen min-h-screen bg-gray-500 bg-opacity-50 fixed top-0 left-0 flex justify-center items-center z-10
              ${
                editUser ? "visible translate-y-0" : "invisible translate-y-20"
              }`}
            >
              <Card
                color="white"
                shadow={false}
                className="relative p-10 py-4 shadow-md"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Typography
                  variant="h4"
                  color="blue-gray"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Edit your info
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                  <div className="mb-1 flex flex-col gap-6 overflow-y-scroll h-[50vh] pb-10">
                    <div className="flex items-center">
                      {preview ? (
                        <Image
                          width={1024}
                          height={1024}
                          alt="avatar"
                          src={preview}
                          className="w-20 h-20 object-cover object-center rounded-xl"
                        />
                      ) : (
                        <Image
                          width={1024}
                          height={1024}
                          alt="avatar"
                          src={userData.pictureUrl}
                          className="w-20 h-20 object-cover object-center rounded-xl"
                        />
                      )}
                      <div className="h-full ml-5">
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="mb-3"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Profile Picture
                        </Typography>
                        {/* <Button className="" color='black'  > */}
                        <label className="inline-block cursor-pointer rounded-lg bg-black text-white font-bold py-2 px-4 text-sm">
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleChangePicture}
                          />
                          CHANGE
                        </label>
                        {/* </Button> */}
                      </div>
                    </div>
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-3"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
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
                        });
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      crossOrigin={undefined}
                    />
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-3"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
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
                        });
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      crossOrigin={undefined}
                    />
                    {/* pw edit */}
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-3"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Password
                    </Typography>
                    <Input
                      size="lg"
                      placeholder="new password"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      value={userData.password}
                      onChange={(e) => {
                        setUserData({
                          ...userData,
                          password: e.target.value,
                        });
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      crossOrigin={undefined}
                    />
                    {/* about */}
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-3"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      About
                    </Typography>
                    <Textarea
                      placeholder="About you"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      onChange={(e) => {
                        setUserData({
                          ...userData,
                          about: e.target.value,
                        });
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {userData.about}
                    </Textarea>
                  </div>
                  <button
                    className="inline-block cursor-pointer rounded-lg bg-black shadow-lg text-white font-bold py-2 w-full text-sm mt-6"
                    onClick={(e) => {
                      e.preventDefault();
                      seteditload("true");
                      let go = false;
                      const formData = new FormData();
                      let urlFile = userData.pictureUrl;
                      let username: string | string | undefined =
                        nameshow.current;

                      formData.append("file", filepp);
                      fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/`, {
                        method: "POST",
                        body: formData,
                      })
                        .then(async (res) => {
                          if (filepp) {
                            if (!res.ok) {
                              throw new Error("Upload error");
                            }
                            return await res.json();
                          }
                        })
                        .then((datares) => {
                          if (filepp) urlFile = datares.uploadFile.url;
                        })
                        .then(() => {
                          if (userData.name != username) {
                            go = true;
                            username =
                              userData.name.replace(/\s+/g, "-") +
                              "-" +
                              Date.now();
                          } else {
                            username = usernameparam;
                          }
                          fetch("api/edit", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              ...userData,
                              pictureUrl: urlFile,
                              username,
                            }),
                          });
                        })
                        .then((res) => {
                          update({
                            ...session,
                            user: {
                              email: userData.email,
                              name: userData.name,
                              token: session.user.token,
                              username,
                              _id: userData.userid,
                              pictureUrl: userData.pictureUrl,
                            },
                          });
                          setUserData({
                            ...userData,
                            pictureUrl: urlFile,
                          });
                          seteditload("false");
                        })
                        .then(() => {
                          seteditUser(false);
                          if (go) router.push("/" + username);
                        })
                        .catch((e) => {
                          //console.log(e)
                          seteditload("failed");
                        });
                    }}
                  >
                    EDIT
                  </button>
                  <button
                    className="inline-block cursor-pointer rounded-lg bg-white shadow-lg text-black font-bold py-2 w-full text-sm mt-6"
                    color="white"
                    onClick={(e) => {
                      e.preventDefault();
                      seteditUser(false);
                    }}
                  >
                    CANCEL
                  </button>
                </form>
              </Card>
            </div>
          }
        </>
      );
    }
  }

  return (<>{renderView()}</>)
}

export default UserInfo