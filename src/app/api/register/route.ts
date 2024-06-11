import { NextResponse } from 'next/server'
import { connect } from '@/lib/mongodb'
import User from '@/models/user'
import bcrypt from 'bcryptjs'

export async function POST (req: any) {
  try {
    const { name, email, password, pictureUrl } = await req.json()
    const hashed = await bcrypt.hash(password, 10)
    await connect()
    await User.create({ name, email, password: hashed, pictureUrl })

    return NextResponse.json(
      {
        message: 'User registered',
        data: { name, email, password: hashed, pictureUrl }
      },
      { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error occured' },
      { status: 500 }
    )
  }
}
