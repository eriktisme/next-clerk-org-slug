import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

export const MainHeader = () => {
  return (
    <header
      className={cn(
        'flex shrink-0 items-center justify-between px-4 py-4 transition-[width,height] ease-linear'
      )}
    >
      <SidebarTrigger />
      <UserButton />
    </header>
  )
}
