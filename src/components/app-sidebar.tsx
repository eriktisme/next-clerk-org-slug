'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { HomeIcon } from 'lucide-react'
import { OrganizationSwitcher, useAuth } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

export const AppSidebar = () => {
  const sidebar = useSidebar()
  const { orgSlug } = useAuth()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                'overflow-hidden transition-all [&>div]:w-full',
                sidebar.open ? '' : '-mx-1'
              )}
            >
              <OrganizationSwitcher
                afterCreateOrganizationUrl={(organization) =>
                  `/${organization.slug}`
                }
                afterSelectOrganizationUrl={(organization) =>
                  `/${organization.slug}`
                }
                hidePersonal
                appearance={{
                  elements: {
                    rootBox: {
                      flex: '1',
                      width: '100%',
                    },
                    button: {
                      flex: '1',
                      justifyContent: 'space-between',
                    },
                  },
                }}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${orgSlug}`}>
                    <HomeIcon />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
