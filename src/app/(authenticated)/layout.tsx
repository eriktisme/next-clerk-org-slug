import 'server-only'

import { ReactNode } from 'react'
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await currentUser()
  const { redirectToSignIn } = await auth()

  if (!user) {
    redirectToSignIn()
  }

  return (
    <div className="flex min-h-svh flex-1 items-center justify-center">
      {children}
    </div>
  )
}
