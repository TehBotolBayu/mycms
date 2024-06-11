'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { getSession, useSession } from 'next-auth/react'

import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography
} from '@material-tailwind/react'

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
// import Router from "next/navigation";
import { useRouter, redirect } from 'next/navigation'
import Link from 'next/dist/client/link'

interface NavItemProps {
  children: React.ReactNode
  href?: string
  others: string
  // clickEvent: () => void;
}

function NavItem ({ children, href, others }: NavItemProps) {
  return (
    <li>
      <Typography
        as="a"
        href={href || '#'}
        // target={href ? "_blank" : "_self"}
        variant="small"
        className={`font-medium ${others}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        {children}
      </Typography>
    </li>
  )
}

export function Navbar () {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [search, setSearch] = useState('')

  const { data: session, status }:{data:any, status:any} = useSession()

  // useEffect(() => {
  //   (() => {
  //     console.log(session)
  //   })()
  // }, [session])

  function handleOpen () {
    setOpen((cur) => !cur)
  }

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpen(false)
    )
  }, [])

  useEffect(() => {
    function handleScroll () {
      if (window.scrollY > 0) {
        setIsScrolling(true)
      } else {
        setIsScrolling(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => { window.removeEventListener('scroll', handleScroll) }
  }, [])

  const searchHandler = (e) => {
    e.preventDefault()
    router.push('/result/' + search)
  }

  return (
    <MTNavbar
      fullWidth
      shadow={false}
      blurred={false}
      color={'white'}
      className="fixed top-0 z-50 border-0 border-b-2 p-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      <div className="container mx-auto flex items-center justify-end md:justify-center">
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            'text-gray-900'
          }`}
        >
          <NavItem href='/' others={''}>
            <img src="/home.png" className="w-7 cursor-pointer"/>
          </NavItem>

          <li>
            <form className="max-w-md w-96">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input onChange={(e) => { setSearch(e.target.value) }} type="text" id="default-search" className="mr-2 block w-full p-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search article..." required />
                    <Button color="gray" onClick={(e) => { searchHandler(e) } } className="py-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Search</Button>
                </div>
            </form>
          </li>
          {
            (status == 'authenticated') &&
          <NavItem href='/draft' others={''}>
            <img src="/writing.png" className="w-7 cursor-pointer"/>
          </NavItem>
          }

        </ul>
        <div className="hidden md:block items-center lg:flex gap-2 profileButton absolute right-10">
        {
          (() => {
            if (status == 'loading') {
              return (
                <></>
              )
            } else if (status == 'unauthenticated') {
              return (
                <>
                <Link href='/login'>
                  <button className="button2 bg-white text-black shadow-lg px-4">SIGN IN</button>
                </Link>
                <Link href='/register'>
                  <button className="button2 bg-black text-white shadow-lg px-4">SIGN UP</button>
                </Link>
              </>
              )
            } else {
              return (
                <>
                <Link href={'/' + session?.user?.username}>
                  <img src="/profile-user.png" className="w-7 cursor-pointer rounded-full hidden md:block"/>
                </Link>
                </>
              )
            }
          })()
        }
        </div>
          <div className="text-black dark:text-white mr-2 md:hidden" onClick={handleOpen}>
          {open
            ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
              )
            : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
              )}
        </div >
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-4 rounded-lg bg-white px-6 py-5">
          <ul className="flex flex-col gap-4 text-blue-gray-900 text-black ">
            <NavItem href="/" others="text-lg">Home</NavItem>
            {
              (status == 'authenticated') &&
              <>
              <NavItem href={'/' + session?.user?.username} others="text-lg">My Profile</NavItem>
              <NavItem href="/draft" others="text-lg">Write</NavItem>
              </>
            }
            <NavItem href="/login" others="text-lg">Log In</NavItem>
            <NavItem href='/register' others="text-lg">Sign In</NavItem>
          </ul>
        </div>
      </Collapse>
    </MTNavbar>
  )
}

export default Navbar
