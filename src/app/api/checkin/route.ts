import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkins, guestIds } from '@/lib/schema'
import { sendOwnerNotification, sendGuestConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Insert main check-in
    const [checkin] = await db.insert(checkins).values({
      firstName:       body.firstName,
      lastName:        body.lastName,
      email:           body.email,
      phone:           body.phone,
      city:            body.city || null,
      state:           body.state || null,
      checkinDate:     body.checkinDate,
      checkoutDate:    body.checkoutDate,
      airbnbBookingId: body.airbnbBookingId,
      purposeOfVisit:  body.purposeOfVisit || null,
      guestCount:      body.guestCount,
      specialRequests: body.specialRequests || null,
      status:          'pending',
    }).returning({ id: checkins.id })

    // Insert per-guest ID rows
    if (body.guests?.length) {
      await db.insert(guestIds).values(
        body.guests.map((g: any, i: number) => ({
          checkinId:  checkin.id,
          guestIndex: i,
          isPrimary:  i === 0,
          guestName:  g.guestName,
          idType:     g.idType,
          idNumber:   g.idNumber,
          idFrontUrl: g.idFrontUrl || null,
          idBackUrl:  g.idBackUrl  || null,
        }))
      )
    }

    // Send emails — non-blocking, failure doesn't break submission
    Promise.all([
      sendOwnerNotification(body, checkin.id),
      sendGuestConfirmation(body),
    ]).catch(e => console.warn('Email error (non-fatal):', e))

    return NextResponse.json({ success: true, id: checkin.id })
  } catch (err: any) {
    console.error('Checkin error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
