'use client'

import React from 'react'
import {
  createEditor,
  type Descendant
} from 'slate'
import { Typography } from '@material-tailwind/react'
import {
  Slate,
  Editable
} from 'slate-react'
import { css } from '@emotion/css'
import Link from 'next/link'
import { Leaf, RenderElement } from '@/app/utils/slateRender'
import Image from 'next/image'
interface userDataType {
  _id: string
  name: string
  email: string
  username: string
  password: string
  pictureUrl: string
  createdAt: string
  updatedAt: string
  __v: number | null | undefined
}

interface contentDataType {
  _id: string
  titleid: string
  title: string
  content: Descendant[]
  author: string
  cover: string
  tags: string[]
  createdAt: string
  updatedAt: string
  __v: 0
}

function ReadArticle ({ contentData, userData }: { contentData: contentDataType, userData: userDataType }) {
  const renderElement = (props) => <RenderElement {...props} />
  const renderLeaf = (props) => <Leaf {...props} />
  const editor = createEditor()

  const formatDate = () => {
    const date = new Date(contentData.updatedAt)
    const options: any = { day: 'numeric', month: 'long', year: 'numeric' }
    const formattedDate = date.toLocaleDateString('id-ID', options)
    return formattedDate
  }

  return (
    <div className=" my-14 md:my-32 md:mx-auto px-10  max-w-screen-md w-full min-h-screen">
      <div className="border-b-2 w-full py-5 mb-10">
        <h1 className="font-bold text-5xl mb-4">{contentData.title}</h1>
        <div className="flex my-2">
          {contentData.tags.map((tag) => {
            return (
              <div
                key={tag}
                className="text-sm rounded-full w-fit py-1 px-3 border border-gray-400 bg-gray-50 text-gray-500 mr-2 "
              >
                {tag}
              </div>
            )
          })}
        </div>
        <div>
          <Link href={'/' + userData.username} className="flex items-center">
            {userData.pictureUrl
              ? (
              <img
                src={userData.pictureUrl}
                alt=""
                className="w-8 h-8 rounded-full"
              />
                )
              : (
              <div className="w-8 h-8 rounded-full bg-black text-white text-2xl text-center">
                {userData.name[0].toUpperCase()}
              </div>
                )}
            <div className="ml-8 flex-col justify-between">
              <div>
                author <span className="font-bold">{userData.name}</span>
              </div>
              <p>ditulis pada {formatDate()}</p>
            </div>
          </Link>
        </div>
        <Image
          src={contentData.cover || '/image/blogs/blog-1.png'}
          width={1000}
          height={1000}
          className='py-4 w-full max-h-[50vh] object-cover object-center' alt={''}        />
      </div>
      <Slate editor={editor} initialValue={contentData.content}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly={true}
        />
      </Slate>
    </div>
  )
}

export default ReadArticle
