import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkins, guestIds } from '@/lib/schema'
import { eq, desc, ilike, or, gte, and } from 'drizzle-orm'

function verifyToken(req: NextRequest) {
  return req.headers.get('x-admin-token') === process.env.ADMIN_SECRET_TOKEN
}

export async function GET(req: NextRequest) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range  = searchParams.get('range')  || 'all'
  const status = searchParams.get('status') || 'all'
  const search = searchParams.get('search') || ''

  const conditions: any[] = []

  if (range !== 'all') {
    const from = new Date()
    if (range === 'today') from.setHours(0, 0, 0, 0)
    else if (range === 'week')  from.setDate(from.getDate() - 7)
    else if (range === 'month') from.setDate(from.getDate() - 30)
    conditions.push(gte(checkins.submittedAt, from))
  }

  if (status !== 'all') {
    conditions.push(eq(checkins.status, status as any))
  }

  if (search) {
    conditions.push(
      or(
        ilike(checkins.firstName,       `%${search}%`),
        ilike(checkins.lastName,        `%${search}%`),
        ilike(checkins.email,           `%${search}%`),
        ilike(checkins.bookingId,       `%${search}%`),
        ilike(checkins.phone,           `%${search}%`),
      )
    )
  }

  const rows = await db.query.checkins.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: desc(checkins.submittedAt),
    with: { guestIds: { orderBy: guestIds.guestIndex } },
  })

  return NextResponse.json({ data: rows })
}

export async function PATCH(req: NextRequest) {
  if (!verifyToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, status } = await req.json()
  await db.update(checkins)
    .set({ status, updatedAt: new Date() })
    .where(eq(checkins.id, id))

  return NextResponse.json({ success: true })
}
