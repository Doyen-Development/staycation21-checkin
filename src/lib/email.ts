import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOwnerNotification(data: any, checkinId: string) {
  const guestList = (data.guests || [])
    .map((g: any, i: number) =>
      `<tr style="border-top:1px solid #f3f4f6">
        <td style="padding:8px 14px;color:#6b7280">Guest ${i + 1}</td>
        <td style="padding:8px 14px;color:#111">${g.guestName} — ${g.idType?.replace('_', ' ')} #${g.idNumber}</td>
      </tr>`
    ).join('')

  await resend.emails.send({
    from: `Staycation21 <${process.env.EMAIL_FROM}>`,
    to:   process.env.NOTIFY_EMAIL!,
    subject: `New check-in: ${data.firstName} ${data.lastName} · ${data.checkinDate}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:12px">
        <div style="background:#0B1D3A;padding:20px 24px;border-radius:8px;margin-bottom:20px">
          <h2 style="color:#fff;margin:0;font-size:17px;font-weight:500">New guest check-in · Staycation21</h2>
          <p style="color:rgba(255,255,255,0.45);margin:4px 0 0;font-size:12px">${(data.bookingSource || 'airbnb').replace('_',' ')} · ${data.bookingId || 'No reference'}</p>
        </div>
        <table style="width:100%;font-size:13px;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
          <tr><td style="padding:8px 14px;color:#6b7280;width:130px">Guest</td><td style="padding:8px 14px;font-weight:500;color:#111">${data.firstName} ${data.lastName}</td></tr>
          <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 14px;color:#6b7280">Email</td><td style="padding:8px 14px;color:#111">${data.email}</td></tr>
          <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 14px;color:#6b7280">Phone</td><td style="padding:8px 14px;color:#111">${data.phone}</td></tr>
          <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 14px;color:#6b7280">Check-in</td><td style="padding:8px 14px;color:#111">${data.checkinDate}</td></tr>
          <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 14px;color:#6b7280">Check-out</td><td style="padding:8px 14px;color:#111">${data.checkoutDate}</td></tr>
          <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 14px;color:#6b7280">Guests</td><td style="padding:8px 14px;color:#111">${data.guestCount}</td></tr>
          <tr style="border-top:1px solid #f3f4f6"><td style="padding:8px 14px;color:#6b7280">Purpose</td><td style="padding:8px 14px;color:#111">${data.purposeOfVisit || '—'}</td></tr>
          ${guestList}
        </table>
        ${data.specialRequests ? `<p style="margin-top:12px;font-size:12px;color:#6b7280;background:#fff;padding:10px 14px;border-radius:8px;border:1px solid #e5e7eb"><strong>Special requests:</strong> ${data.specialRequests}</p>` : ''}
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard" style="display:inline-block;background:#0B1D3A;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;margin-top:16px">Open admin panel →</a>
      </div>`,
  })
}

export async function sendGuestConfirmation(data: any) {
  await resend.emails.send({
    from: `Staycation21 <${process.env.EMAIL_FROM}>`,
    to:   data.email,
    subject: `Check-in confirmed · Staycation21 · ${data.checkinDate}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:580px;margin:0 auto">
        <div style="background:#0B1D3A;padding:28px 24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px;font-weight:500">You're all checked in!</h1>
          <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px">We have your details and will be in touch before your arrival.</p>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px">
          <p style="margin:0 0 16px;color:#374151;font-size:14px">Hi ${data.firstName},</p>
          <table style="width:100%;font-size:13px;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
            <tr style="background:#f9fafb"><td colspan="2" style="padding:10px 14px;font-weight:500;color:#111;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Stay summary</td></tr>
            <tr><td style="padding:8px 14px;color:#6b7280;width:120px;border-top:1px solid #f3f4f6">Property</td><td style="padding:8px 14px;color:#111;border-top:1px solid #f3f4f6">Staycation21, Sonipat, Haryana</td></tr>
            <tr><td style="padding:8px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Arrival</td><td style="padding:8px 14px;color:#111;border-top:1px solid #f3f4f6">${data.checkinDate} after 2:00 PM</td></tr>
            <tr><td style="padding:8px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Departure</td><td style="padding:8px 14px;color:#111;border-top:1px solid #f3f4f6">${data.checkoutDate} by 11:00 AM</td></tr>
            <tr><td style="padding:8px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Booking reference</td><td style="padding:8px 14px;color:#111;border-top:1px solid #f3f4f6;font-family:monospace">${data.bookingId || '—'}</td></tr>
            <tr><td style="padding:8px 14px;color:#6b7280;border-top:1px solid #f3f4f6">Guests</td><td style="padding:8px 14px;color:#111;border-top:1px solid #f3f4f6">${data.guestCount}</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">Questions? WhatsApp us at <strong style="color:#6b7280">${process.env.NEXT_PUBLIC_CONTACT_PHONE}</strong></p>
        </div>
      </div>`,
  })
}
