import { connect } from '@/lib/mongodb'
import User from '@/models/user'
import { NextResponse } from 'next/server'
import url from 'url'

export async function POST (req: any) {
  try {
    await connect()
    const { email } = await req.json()
    const user = await User.findOne({ email }).select('_id')
    console.log('user: ', user)
    return NextResponse.json({ user })
  } catch (error) {
    console.log(error)
  }
}

export async function GET (req: any) {
  try {
    await connect()
    const parsedUrl = url.parse(req.url, true)
    const { pathname, query } = parsedUrl
    const username = query.username
    const user = await User.findOne({ username })
    console.log('user: ', user)
    return NextResponse.json({ user })
  } catch (error) {
    console.log(error)
  }
}
