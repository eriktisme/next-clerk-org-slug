import 'server-only'

import { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { MainHeader } from '@/components/main-header'
import { cookies } from 'next/headers'

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex min-h-svh flex-1 flex-col">
        <MainHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}
