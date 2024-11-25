import 'server-only'

import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await currentUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  )
}
