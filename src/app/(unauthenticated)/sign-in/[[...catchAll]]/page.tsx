import dynamic from 'next/dynamic'
import { Metadata } from 'next'
const SignIn = dynamic(() => import('@clerk/nextjs').then((mod) => mod.SignIn))

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function Page() {
  return <SignIn />
}
