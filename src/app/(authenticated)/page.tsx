'use client'

import { OrganizationList } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-svh flex-1 items-center justify-center">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl={(organization) => `/${organization.slug}`}
        afterSelectOrganizationUrl={(organization) => `/${organization.slug}`}
      />
    </div>
  )
}
