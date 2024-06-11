import { NextResponse } from 'next/server'
import { connect } from '@/lib/mongodb'
import User from '@/models/user'
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import url from 'url'

export async function GET (req: any) {
  const parsedUrl = url.parse(req.url, true)
  try {
    await connect()
    const { pathname, query } = parsedUrl
    // console.log('the query')
    // console.log(query.userid)

    const user = await User.findById(query.userid)
    // const userid = query.userid;
    return NextResponse.json(user)
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.log(error)
  }
}
