import { 
    createEditor, 
    Descendant,
    Element,
  } from 'slate'
  import { Typography } from '@material-tailwind/react'
  import {
    Slate,
    Editable,
  } from 'slate-react'
  import { css } from '@emotion/css'
  import Link from 'next/link'

export const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
  
    if (leaf.code) {
      children = <code>{children}</code>
    }
  
    if (leaf.italic) {
      children = <em>{children}</em>
    }
  
    if (leaf.underline) {
      children = <u>{children}</u>
    }
  
    return <span {...attributes}>{children}</span>
  }
  
  export const RenderElement = (props) => {
    const { attributes, children, element } = props
    const style = { textAlign: element.align }
    switch (element.type) {
      case 'image':
        return <Image {...props} />
      case 'block-quote':
        return (
          <blockquote style={style} className="italic text-gray-400 my-4 font-serif text-lg" {...attributes}>
            " {children} "
          </blockquote>
        )
      case 'bulleted-list':
        return (
          <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 my-4 font-serif text-lg" style={style} {...attributes}>
            {children}
          </ul>
        )
      case 'heading-one':
        return (
          <h1 style={style} {...attributes} className="b my-4 font-serif text-lg">
            {children}
          </h1>
        )
      case 'heading-two':
        return (
          <h2 style={style} {...attributes} className='my-4 font-serif text-lg'>
            {children}
          </h2>
        )
      case 'list-item':
        return (
          <li style={style} {...attributes} className='my-4 font-serif text-lg'>
            {children}
          </li>
        ) 
      case 'numbered-list':
        return (
          <ol className='max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400 my-4 font-serif text-lg' style={style} {...attributes}>
            {children}
          </ol>
        )
      default:
        return (
          <p style={style} {...attributes} className='my-4 font-serif text-lg'>
            {children}
          </p>
        )
    }
  }
  
  export const Image = ({ attributes, children, element }) => {
    return (
      <div {...attributes}>
        {children}
        <div
          contentEditable={false}
          className={css`
            position: relative;
          `}
        >
          <img
            src={element.url}
            className="w-full"
          />
        </div>
      </div>
    )
  }

  export const renderPlaceHolder = ({ attributes, children}) => {
    return (
      <div className=' -translate-x-6 px-6 py-4' {...attributes}>
        {children}
      </div>
    )
  }