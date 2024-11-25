import 'server-only'

import { ReactNode } from 'react'
import { auth, currentUser } from '@clerk/nextjs/server'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

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
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
