'use client'

import { OrganizationList } from '@clerk/nextjs'

export default function Page() {
  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl={(organization) => `/${organization.slug}`}
      afterSelectOrganizationUrl={(organization) => `/${organization.slug}`}
    />
  )
}
