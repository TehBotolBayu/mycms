'use client'

import Confirmation from './Confirmation'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { createEditor, Descendant, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Icon, Toolbar } from '@/components/slate'
import {
  Button,
  Typography,
  Card,
  CardBody
} from '@material-tailwind/react'
import BlogPostCardH from './blog-post-card-h'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { type User } from '@/types/User'

const ReadOnly = ({ userid, userdata, token }: { userid: string, userdata: User, token: any }) => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const router = useRouter()
  const [items, setItems] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [index, setIndex] = useState(1)

  const fetchData = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/article/user/page?page=${index}&id=${userdata.userid}`)
      .then((res) => {
        setItems((prevItems: any) => [...prevItems, ...res.data.data])
      })
      .catch((err) => { console.log(err) })
    setIndex((prevIndex) => prevIndex + 1)

    setIsLoading(false)
  }, [index, isLoading])

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/article/user/page?page=0&id=${userdata.userid}`
        )
        setItems(response.data.data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    getData()
  }, [userdata])

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchData()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fetchData])

  const generatePlainText = nodes => {
    return nodes.map(n => Node.string(n)).join('\n')
  }

  const deleteArticle = async (articleId: string) => {
    try {
      const filteredData = items!.filter((item: any) => item._id != articleId)
      setItems(filteredData)
      const resdata = await fetch(`http://127.0.0.1:3300/api/v1/article/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const dataa = await resdata.json()
    } catch (error) {
      console.log(error)
    }
  }

  const editArticle = (articleId: any) => {
    try {
      const savedata = items!.filter((item: any) => item._id == articleId)[0]
      localStorage.setItem('dataArticle', JSON.stringify(savedata))
      router.push('/draft')
    } catch (error) {
      console.log(error)
    }
  }
  const [deleteprompt, setdeleteprompt] = useState(false)
  const [confirm, setconfirm] = useState(false)
  const [aid, setaid] = useState<any>(-1)

  useEffect(() => {
    (() => {
      if (confirm) {
        deleteArticle(aid)
        setdeleteprompt(false)
        setconfirm(false)
      }
    })()
  }, [confirm])

  return (
    <>
          {
        (deleteprompt) &&
        <div className='fixed h-screen w-screen top-0 right-0 flex justify-center items-center z-[20]'>
        <Confirmation setconfirmation={setconfirm} setopen={setdeleteprompt} others='relative bg-white ' />
      </div>
      }
    <section className="py-12 container ">
        {
        items.map((e, i) => {
          let text: string = generatePlainText(e.content)
          if (text.length > 100) {
            text = text.substring(0, 100) + '...'
          }
          let tes
          if (userid == e.author) {
            tes = (<div className='flex flex-col justify-between h-full ml-1 '>
                  <Button color="gray" className='mx-1 my-1 p-1 hover:-translate-y-2 transition-all ease-in' onClick={(event) => { setaid(e._id); setdeleteprompt(true) } } placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <Icon>delete</Icon>
                  </Button>
                  <Button color="white" className='mx-1 my-1 p-1 hover:-translate-y-2 transition-all ease-in' onClick={(event) => { editArticle(e._id) } } placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <Icon>edit</Icon>
                  </Button>
                  </div>)
          } else tes = <></>
          return (
              <div className='flex ' key={e._id}>
                <div onClick={() => { router.push(e.links.read) }} className='cursor-pointer hover:-translate-y-2 transition-all ease-in mb-4 w-full'>
                  <BlogPostCardH title={e.title} desc={text} img={e?.cover || '/image/blogs/blog-1.png'} tags={[]} date={''} name={''}/>
                </div>
                {tes}
              </div>
          )
        })
        }
    </section></>
  )
}

export default ReadOnly
