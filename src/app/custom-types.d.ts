import { type Descendant, type BaseEditor, type BaseRange, type Range, type Element } from 'slate'
import { type ReactEditor } from 'slate-react'
import { type HistoryEditor } from 'slate-history'

export interface BlockQuoteElement {
  type: 'block-quote'
  align?: string
  children: Descendant[]
}

export interface BulletedListElement {
  type: 'bulleted-list'
  align?: string
  children: Descendant[]
}

export interface CheckListItemElement {
  type: 'check-list-item'
  checked: boolean
  children: Descendant[]
}

export interface EditableVoidElement {
  type: 'editable-void'
  children: EmptyText[]
}

export interface HeadingElement {
  type: 'heading'
  align?: string
  children: Descendant[]
}

export interface HeadingTwoElement {
  type: 'heading-two'
  align?: string
  children: Descendant[]
}

export interface ImageElement {
  type: 'image'
  url: string
  children: EmptyText[]
}

export interface LinkElement { type: 'link', url: string, children: Descendant[] }

export interface ButtonElement { type: 'button', children: Descendant[] }

export interface BadgeElement { type: 'badge', children: Descendant[] }

export interface ListItemElement { type: 'list-item', children: Descendant[] }

export interface MentionElement {
  type: 'mention'
  character: string
  children: CustomText[]
}

export interface ParagraphElement {
  type: 'paragraph'
  align?: string
  children: Descendant[]
}

export interface TableElement { type: 'table', children: TableRow[] }

export interface TableCellElement { type: 'table-cell', children: CustomText[] }

export interface TableRowElement { type: 'table-row', children: TableCell[] }

export interface TitleElement { type: 'title', children: Descendant[] }

export interface VideoElement { type: 'video', url: string, children: EmptyText[] }

export interface CodeBlockElement {
  type: 'code-block'
  language: string
  children: Descendant[]
}

export interface CodeLineElement {
  type: 'code-line'
  children: Descendant[]
}

type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingElement
  | HeadingTwoElement
  | ImageElement
  | LinkElement
  | ButtonElement
  | BadgeElement
  | ListItemElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | VideoElement
  | CodeBlockElement
  | CodeLineElement

export interface CustomText {
  bold?: boolean
  italic?: boolean
  code?: boolean
  text: string
}

export interface EmptyText {
  text: string
}

export type CustomEditor = BaseEditor &
ReactEditor &
HistoryEditor & {
  nodeToDecorations?: Map<Element, Range[]>
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText | EmptyText
    Range: BaseRange & Record<string, unknown>
  }
}
