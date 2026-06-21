import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkins, guestIds } from '@/lib/schema'
import { sendOwnerNotification, sendGuestConfirmation } from '@/lib/email'
import { sendWhatsAppConfirmation } from '@/lib/whatsapp'

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
      bookingSource:   body.bookingSource || 'airbnb',
      bookingId:       body.bookingId || '',
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

    // Notify owner by email — non-blocking, failure doesn't break submission
    sendOwnerNotification(body, checkin.id)
      .catch(e => console.warn('Owner email error (non-fatal):', e))

    // Confirm to guest on BOTH email and WhatsApp — sent independently so
    // one channel failing never blocks the other or the check-in itself
    sendGuestConfirmation(body)
      .catch(e => console.warn('Guest email error (non-fatal):', e))

    sendWhatsAppConfirmation({
      firstName:    body.firstName,
      phone:        body.phone,
      checkinDate:  body.checkinDate,
      checkoutDate: body.checkoutDate,
      guestCount:   body.guestCount,
      bookingId:    body.bookingId,
      propertyName: process.env.NEXT_PUBLIC_PROPERTY_NAME || 'Staycation21',
    }).then(result => {
      if (!result.ok) console.warn('WhatsApp confirmation not sent (non-fatal):', result.error)
    })

    return NextResponse.json({ success: true, id: checkin.id })
  } catch (err: any) {
    console.error('Checkin error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
