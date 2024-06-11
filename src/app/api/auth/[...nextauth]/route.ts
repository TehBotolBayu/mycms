import NextAuth from 'next-auth/next'
import {authOptionsData} from '@/lib/authOptions'

const handler = NextAuth(authOptionsData)

export { handler as GET, handler as POST }


