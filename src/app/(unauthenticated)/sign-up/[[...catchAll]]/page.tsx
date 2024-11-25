import dynamic from 'next/dynamic'
import { Metadata } from 'next'
const SignUp = dynamic(() => import('@clerk/nextjs').then((mod) => mod.SignUp))

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default async function Page() {
  return <SignUp />
}
