'use client'

import { ToastContainer, toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { User } from '@/types/User'
import Image from 'next/image'
import {
  Card,
  Input,
  Checkbox,
  Typography,
  Button as MButton
} from '@material-tailwind/react'
import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef
} from 'react'
import { useSession, getSession } from 'next-auth/react'
import { useRouter, redirect } from 'next/navigation'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import isHotkey from 'is-hotkey'
import { Transforms, createEditor, type Descendant, Editor, Element } from 'slate'

import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
  ReactEditor,
  useSlate
} from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'

import { Button, Icon, Toolbar } from '@/components/slate'

import { RenderElement, Leaf, renderPlaceHolder } from '../utils/slateRender'

import { Session } from 'next-auth'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code'
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export interface EmptyText {
  text: string
}

export interface ImageElement {
  type: 'image'
  url: string
  children: EmptyText[]
}

const tags = [
  'Tutorial',
  'HowTo',
  'DIY',
  'Review',
  'Tech',
  'Gaming',
  'Travel',
  'Fitness',
  'Cooking',
  'Vlog'
]

const Draft = () => {
  const toastId = useRef<any>(null)
  const [urlcover, seturlcover] = useState('')

  const [content, setcontent] = useState<Descendant[]>(initialValue)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<any>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [title, settitle] = useState('')
  const [openReview, setopenReview] = useState(false)
  const [loadlocal, setloadlocal] = useState(true)

  const renderElement = useCallback(
    (props) => <RenderElement {...props} />,
    []
  )
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )

  const router = useRouter()
  const inputRef = useRef<any>(null)
  const { data: session, status } : {data: any, status: any} = useSession()

  // const [session, setSession] = useState<any>(false)
  const [userId, setuserId] = useState<string>('')
  const [mode, setmode] = useState('create')
  const [contentId, setcontentId] = useState(null)
  const [changeload, setchangeload] = useState('false')

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
      render: <div className='flex items-center text-red-600'><span className='mr-2'>Upload Failed</span></div>,
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
    if (changeload == 'true') { notifyLoad() } else if (changeload == 'false') notifyResult()
    else if (changeload == 'failed') notifyError()
  }, [changeload])

  useEffect(() => {
    if (localStorage.getItem('dataArticle')) {
      setcontent(JSON.parse(localStorage.getItem('dataArticle')!).content)
      setcontentId(JSON.parse(localStorage.getItem('dataArticle')!)._id)
      settitle(JSON.parse(localStorage.getItem('dataArticle')!).title)
      seturlcover(JSON.parse(localStorage.getItem('dataArticle')!).cover)
      setSelected(JSON.parse(localStorage.getItem('dataArticle')!).tags || [])
      localStorage.removeItem('dataArticle')
      setmode('edit')
    } else setloadlocal(false)
  }, [])

  useEffect(() => {
    setloadlocal(false)
  }, [content])

  useEffect(() => {
    (() => {
      if (status == 'unauthenticated') {
        router.push('/login')
      } else if (status == 'authenticated') {
        setuserId(session.user._id)
      }
    })()
  }, [session])

  const filteredTags = tags.filter(
    (item: any) =>
      item?.toLocaleLowerCase()?.includes(query.toLocaleLowerCase()?.trim()) &&
      !selected.includes(item)
  )

  const isDisable =
    !query?.trim() ||
    selected.filter(
      (item:string) =>
        item?.toLocaleLowerCase()?.trim() === query?.toLocaleLowerCase()?.trim()
    )?.length

  const handleCoverUpload = async (e) => {
    e.preventDefault();
    const file = filepp
    // //console.log(file)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) {
        throw new Error('Upload error')
      }
      const datares = await res.json()
      const urlFile = await datares.uploadFile.url
      //console.log(datares)
      if (urlFile && !isImageUrl(urlFile)) {
        alert('URL is not an image')
        return
      }
      // //console.log(urlFile)
      seturlcover(urlFile)
      return await urlFile
    } catch (error) {
      //console.log('upload error: ', error)
    }
  }

  // useEffect(()=>{
  //   //console.log(urlFile)
  // }, [urlFile])

  const [filepp, setfilepp] = useState<any>(null)
  const [preview, setPreview] = useState<any>(null)

  const handleChangePicture = (e: any) => {
    e.preventDefault();
    const file = e.target.files[0]
    setfilepp(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

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
      {(() => {
        if (openReview) {
          return (
            <>
              <div className="min-w-screen min-h-screen w-full h-fit  bg-gray-500 bg-opacity-50 fixed py-32 top-0 left-0 flex justify-center z-10">
                <Card
                  color="white"
                  shadow={false}
                  className=" p-10 shadow-md h-[500px]" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  <Typography variant="h4" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Review Draft
                  </Typography>
                  <form className="mt-8 mb-2 sm:w-96 overflow-scroll overflow-x-hidden">
                    <div className="mb-1 flex flex-col gap-6">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="-mb-3" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        Title
                      </Typography>
                      <Input
                        size="lg"
                        placeholder="title"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                          className: 'before:content-none after:content-none'
                        }}
                        value={title}
                        onChange={(e) => { settitle(e.target.value) } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}                      />
                      {/* <Typography variant="h6" color="blue-gray" className="-mb-3">
                Cover Image
              </Typography>
              <input type="file" onChange={(e) => handleImageCover(e)}/> */}

                      <div className="flex items-center">
                        {preview
                          ? (
                          <Image
                            width={1024}
                            height={1024}
                            alt="avatar"
                            src={preview}
                            className="w-28 h-20 object-cover object-center"
                          />
                            )
                          : (
                          <Image
                            width={1024}
                            height={1024}
                            alt="avatar"
                            src={urlcover || '/image/blogs/blog-1.png'}
                            className="w-28 h-20 object-cover object-center"
                          />
                            )}
                        <div className="h-full ml-5">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-3" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            Article Cover
                          </Typography>
                          {/* <Button className="" color='black'  > */}
                          <label className="inline-block cursor-pointer rounded-lg bg-black text-white font-bold py-2 px-4 text-sm">
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleChangePicture}
                            />
                            SELECT FILE
                          </label>
                          {/* </Button> */}
                        </div>
                      </div>

                      <div className=" bg-white grid">
                        <div className="relative w-80 text-sm">
                          {selected?.length
                            ? (
                            <div className="bg-white w-80 relative text-xs flex flex-wrap gap-1 p-2 mb-2">
                              {selected.map((tag) => {
                                return (
                                  <div
                                    key={tag}
                                    className="rounded-full w-fit py-1.5 px-3 border border-gray-400 bg-gray-50 text-gray-500
                  flex items-center gap-2"
                                  >
                                    {tag}
                                    <div
                                      onMouseDown={(e) => { e.preventDefault() }}
                                      onClick={() => {
                                        setSelected(
                                          selected.filter((i) => i !== tag)
                                        )
                                      }
                                      }
                                    >
                                      <div>X</div>
                                    </div>
                                  </div>
                                )
                              })}
                              <div className="w-full text-right">
                                <div
                                  className="text-gray-400 cursor-pointer"
                                  onClick={() => {
                                    setSelected([])
                                    inputRef.current?.focus()
                                  }}
                                >
                                  Clear all
                                </div>
                              </div>
                            </div>
                              )
                            : null}
                          <div className="card flex items-center justify-between p-3 w-80 gap-2.5">
                            <div>search</div>
                            <input
                              ref={inputRef}
                              type="text"
                              value={query}
                              onChange={(e) => { setQuery(e.target.value.trimStart()) }
                              }
                              placeholder="Search or Create tags"
                              className="bg-transparent text-sm flex-1 caret-rose-600"
                              onFocus={() => { setMenuOpen(true) }}
                              onBlur={() => { setMenuOpen(false) }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isDisable) {
                                  setSelected((prev) => [...prev, query])
                                  setQuery('')
                                  setMenuOpen(true)
                                }
                              }}
                            />
                            <button
                              className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                              disabled={isDisable}
                              onClick={() => {
                                if (isDisable) {
                                  return
                                }
                                setSelected((prev) => [...prev, query])
                                setQuery('')
                                inputRef.current?.focus()
                                setMenuOpen(true)
                              }}
                            >
                              + Add
                            </button>
                          </div>

                          {/* Menu's */}
                          {menuOpen ? (
                            <div className="bg-white card absolute w-full max-h-52 mt-2 p-4 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                              <ul className="w-full">
                                {filteredTags?.length ? (
                                  filteredTags.map((tag, i) => (
                                    <li
                                      key={tag}
                                      className="p-2 cursor-pointer hover:bg-rose-50 hover:text-rose-500 rounded-md w-full"
                                      onMouseDown={(e) => { e.preventDefault() }}
                                      onClick={() => {
                                        setMenuOpen(true)
                                        setSelected((prev) => [...prev, tag])
                                        // //console.log(selected);
                                        setQuery('')
                                      }}
                                    >
                                      {tag}
                                    </li>
                                  ))
                                ) : (
                                  <li className="p-2 text-gray-500">
                                    No options available
                                  </li>
                                )}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <button
                      className="mt-6 button2 bg-black text-white w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          setchangeload('true')
                          if (preview) {
                            handleCoverUpload(e)
                              .then(async (urlFile) => {
                                // alert(urlFile);
                                if (mode == 'create') {
                                  return await createArticle(e, {
                                    title,
                                    content,
                                    userId,
                                    urlcover: urlFile,
                                    tags: selected
                                  }, session)
                                } else {
                                  return await editArticle(e, {
                                    title,
                                    content,
                                    userId,
                                    contentId,
                                    urlcover: urlFile,
                                    tags: selected
                                  }, session)
                                }
                              })
                              .then((res) => {
                                if (res) {
                                  setopenReview(false)
                                  setchangeload('false')
                                } else {
                                  setopenReview(false)
                                  setchangeload('failed')
                                }
                              })
                          } else {
                            if (mode == 'create') {
                              createArticle(e, {
                                title,
                                content,
                                userId,
                                urlcover,
                                tags: selected
                              }, session).then((res) => {
                                if (res) {
                                  setopenReview(false)
                                  setchangeload('false')
                                } else {
                                  setopenReview(false)
                                  setchangeload('failed')
                                }
                              })
                            } else {
                              editArticle(e, {
                                title,
                                content,
                                userId,
                                contentId,
                                urlcover,
                                tags: selected
                              }, session).then((res) => {
                                if (res) {
                                  setopenReview(false)
                                  setchangeload('false')
                                } else {
                                  setopenReview(false)
                                  setchangeload('failed')
                                }
                              })
                            }
                          }
                        }}
                    >
                      Save
                    </button>
                    <button
                      className="mt-6 button2 bg-white text-black w-full"

                      color="white"
                      onClick={() => { setopenReview(false) }}
                    >
                      Cancel
                    </button>
                  </form>
                </Card>
              </div>
            </>
          )
        }
      })()}
      <div className="mt-14 md:mt-32 md:mx-auto px-10  mx-auto max-w-screen-md w-full ">
        <>
          {!loadlocal && (
            <Slate
              editor={editor}
              initialValue={content}
              onChange={(e) => { setcontent(e) }}
            >
              <div className="sticky top-32 bg-white z-2 my-8 mb-4">
                <div className="flex mb-8">
                  <input
                    type="text"
                    placeholder="title"
                    value={title}
                    onChange={(e) => { settitle(e.target.value) }}
                    className="font-bold text-2xl w-full mr-2"
                  />
                  {mode == 'create'
                    ? (
                    <button
                      onClick={() => { setopenReview(true) }}
                      className="button"
                    >
                      Upload
                    </button>
                      )
                    : (
                    <button
                      onClick={(e) => { setopenReview(true) }}
                      className="button"
                    >
                      Edit
                    </button>
                      )}
                </div>

                <Toolbar>
                  <MarkButton format="bold" icon="format_bold" />
                  <MarkButton format="italic" icon="format_italic" />
                  <MarkButton format="underline" icon="format_underlined" />
                  <MarkButton format="code" icon="code" />
                  <BlockButton format="heading-one" icon="looks_one" />
                  <BlockButton format="heading-two" icon="looks_two" />
                  <BlockButton format="block-quote" icon="format_quote" />
                  <BlockButton
                    format="numbered-list"
                    icon="format_list_numbered"
                  />
                  <BlockButton
                    format="bulleted-list"
                    icon="format_list_bulleted"
                  />
                  <BlockButton format="left" icon="format_align_left" />
                  <BlockButton format="center" icon="format_align_center" />
                  <BlockButton format="right" icon="format_align_right" />
                  <BlockButton format="justify" icon="format_align_justify" />
                  <InsertImageButton />
                </Toolbar>
              </div>
              <Editable
                className="px-6 py-2 h-[50vh] overflow-y-scroll"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                renderPlaceholder={renderPlaceHolder}
                placeholder="Enter some text…"
                spellCheck
                autoFocus
                onKeyDown={(event) => {
                  for (const hotkey in HOTKEYS) {
                    if (isHotkey(hotkey, event as any)) {
                      event.preventDefault()
                      const mark = HOTKEYS[hotkey]
                      toggleMark(editor, mark)
                    }
                  }
                }}
              />
            </Slate>
          )}
        </>
      </div>
    </>
  )
}

const createArticle = async (event, data, session) => {
  event.preventDefault()
  const { title, content, userId, urlcover, tags } = data
  const titleid = title.replace(/\s+/g, '-') + '-' + Date.now()
  console.log('disini');
  
  console.log(session)
  console.log(session?.user?.token);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.token}`
      },
      body: JSON.stringify({
        titleid,
        title,
        content,
        author: userId,
        cover: urlcover,
        tags
      })
    })
    if (res.ok) {
      const data = await res.json()
      return data
    } else {
      return false
    }
  } catch (error) {
    //console.log('Error during upload: ', error)
    return false
  }
}

const editArticle = async (event, data, session) => {
  event.preventDefault()
  const { title, content, userId, contentId, urlcover, tags } = data

  const titleid = title.replace(/\s+/g, '-') + '-' + Date.now()
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/article/${contentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify({
          titleid,
          title,
          content,
          author: userId,
          cover: urlcover,
          tags
        })
      }
    )
    if (res.ok) {
      const data = await res.json()
      //console.log(data)
      return data
    } else {
      return false
    }
  } catch (error) {
    //console.log('Error during upload: ', error)
    return false
  }
}

const withImages = (editor) => {
  const { insertData, isVoid } = editor

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertImage = (editor, url) => {
  const text = { text: '' }
  const image: ImageElement = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }]
  })
}

const handleFile = async (e, editor) => {
  const file = e.target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/`, {
      method: 'POST',
      body: formData
    })
    if (!res.ok) {
      throw new Error('Upload error')
    }
    const datares = await res.json()
    const urlFile = await datares.uploadFile.url
    //console.log(datares)

    if (urlFile && !isImageUrl(urlFile)) {
      alert('URL is not an image')
      return
    }
    urlFile && insertImage(editor, urlFile)
  } catch (error) {
    //console.log('upload error: ', error)
  }
}

const InsertImageButton = () => {
  const editor = useSlateStatic()

  return (
    <label className="inline-block cursor-pointer ">
      <input
        type="file"
        onChange={async (e) => { await handleFile(e, editor) }}
        className="hidden"
      />
      <Icon>image</Icon>
    </label>
  )
}

const isImageUrl = (url) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext!)
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true
  })
  let newProperties: Partial<Element>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format
    }
  }
  Transforms.setNodes<Element>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: '' }] }
]

export default Draft
