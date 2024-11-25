import { log } from '@/lib/observability'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserJSON,
  WebhookEvent,
} from '@clerk/backend'
import { analytics } from '@/lib/analytics'
import { env } from '@/env'

const handleUserCreated = (data: UserJSON) => {
  analytics.identify({
    distinctId: data.id,
    properties: {
      email: data.email_addresses.at(0)?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: new Date(data.created_at),
      avatar: data.image_url,
      phoneNumber: data.phone_numbers.at(0)?.phone_number,
    },
  })

  analytics.capture({
    event: 'User Created',
    distinctId: data.id,
  })

  return new Response('User created', { status: 201 })
}

const handleUserUpdated = (data: UserJSON) => {
  analytics.identify({
    distinctId: data.id,
    properties: {
      email: data.email_addresses.at(0)?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: new Date(data.created_at),
      phoneNumber: data.phone_numbers.at(0)?.phone_number,
    },
  })

  analytics.capture({
    event: 'User Updated',
    distinctId: data.id,
  })

  return new Response('User updated', { status: 201 })
}

const handleUserDeleted = (data: DeletedObjectJSON) => {
  if (data.id) {
    analytics.identify({
      distinctId: data.id,
      properties: {
        deleted: new Date(),
      },
    })

    analytics.capture({
      event: 'User Deleted',
      distinctId: data.id,
    })
  }

  return new Response('User deleted', { status: 201 })
}

const handleOrganizationCreated = (data: OrganizationJSON) => {
  analytics.groupIdentify({
    groupKey: data.id,
    groupType: 'company',
    distinctId: data.created_by,
    properties: {
      name: data.name,
    },
  })

  analytics.capture({
    event: 'Organization Created',
    distinctId: data.created_by,
  })

  return new Response('Organization created', { status: 201 })
}

const handleOrganizationUpdated = (data: OrganizationJSON) => {
  analytics.groupIdentify({
    groupKey: data.id,
    groupType: 'company',
    distinctId: data.created_by,
    properties: {
      name: data.name,
    },
  })

  analytics.capture({
    event: 'Organization Updated',
    distinctId: data.created_by,
  })

  return new Response('Organization updated', { status: 201 })
}

const handleOrganizationDeleted = (data: DeletedObjectJSON) => {
  if (data.id) {
    analytics.groupIdentify({
      groupKey: data.id,
      groupType: 'company',
      properties: {
        deleted: new Date(),
      },
    })

    analytics.capture({
      event: 'Organization Deleted',
      distinctId: data.id,
    })
  }

  return new Response('Organization deleted', { status: 201 })
}

const handleOrganizationMembershipCreated = (
  data: OrganizationMembershipJSON
) => {
  analytics.groupIdentify({
    groupKey: data.organization.id,
    groupType: 'company',
    distinctId: data.public_user_data.user_id,
  })

  analytics.capture({
    event: 'Organization Member Created',
    distinctId: data.public_user_data.user_id,
  })

  return new Response('Organization membership created', { status: 201 })
}

const handleOrganizationMembershipDeleted = (
  data: OrganizationMembershipJSON
) => {
  analytics.capture({
    event: 'Organization Member Deleted',
    distinctId: data.public_user_data.user_id,
  })

  return new Response('Organization membership deleted', { status: 201 })
}

export const POST = async (request: Request): Promise<Response> => {
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = (await request.json()) as object
  const body = JSON.stringify(payload)

  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET)

  let event: WebhookEvent | undefined

  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (error) {
    log.error('Error verifying webhook:', { error })

    return new Response('Error occurred', {
      status: 400,
    })
  }

  const { id } = event.data
  const eventType = event.type

  log.info('Webhook', { id, eventType, body })

  let response: Response = new Response('', { status: 201 })

  switch (eventType) {
    case 'user.created': {
      response = handleUserCreated(event.data)
      break
    }
    case 'user.updated': {
      response = handleUserUpdated(event.data)
      break
    }
    case 'user.deleted': {
      response = handleUserDeleted(event.data)
      break
    }
    case 'organization.created': {
      response = handleOrganizationCreated(event.data)
      break
    }
    case 'organization.updated': {
      response = handleOrganizationUpdated(event.data)
      break
    }
    case 'organization.deleted': {
      response = handleOrganizationDeleted(event.data)
      break
    }
    case 'organizationMembership.created': {
      response = handleOrganizationMembershipCreated(event.data)
      break
    }
    case 'organizationMembership.deleted': {
      response = handleOrganizationMembershipDeleted(event.data)
      break
    }
    default: {
      break
    }
  }

  await analytics.shutdown()

  return response
}
