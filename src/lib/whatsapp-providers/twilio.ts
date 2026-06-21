// Twilio WhatsApp API provider
// Docs: https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates
//
// Setup:
// 1. Create account at twilio.com, get a WhatsApp-enabled sender
//    (Twilio sandbox number for testing, or your own verified number for production)
// 2. Build a template in Console → Messaging → Content Template Builder
//    e.g body: "Hi {{1}}, your check-in for {{2}} is confirmed for {{3}}. Check-out: {{4}}.
//    Guests: {{5}}. Booking ref: {{6}}. Reply here if you need anything."
// 3. Submit for WhatsApp approval (usually minutes, up to 1 business day)
// 4. Copy the Content SID (starts "HX...") into TWILIO_CONTENT_SID
// 5. Set env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, TWILIO_CONTENT_SID

import { WhatsAppProvider, WhatsAppConfirmationData, WhatsAppResult, normalizePhone } from './types'

export const twilioProvider: WhatsAppProvider = {
  name: 'twilio',

  isConfigured() {
    return !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM &&
      process.env.TWILIO_CONTENT_SID
    )
  },

  async send(data: WhatsAppConfirmationData): Promise<WhatsAppResult> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!
    const authToken   = process.env.TWILIO_AUTH_TOKEN!
    const from        = process.env.TWILIO_WHATSAPP_FROM!  // e.g. "whatsapp:+14155238886"
    const contentSid  = process.env.TWILIO_CONTENT_SID!

    const destination = `whatsapp:+${normalizePhone(data.phone)}`

    // Keys "1","2","3"... must match the {{1}}, {{2}}... variables in your approved template
    const contentVariables = JSON.stringify({
      '1': data.firstName,
      '2': data.propertyName || 'Staycation21',
      '3': data.checkinDate,
      '4': data.checkoutDate,
      '5': String(data.guestCount),
      '6': data.bookingId || 'N/A',
    })

    try {
      const body = new URLSearchParams({
        To: destination,
        From: from,
        ContentSid: contentSid,
        ContentVariables: contentVariables,
      })

      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        console.error('Twilio send failed:', res.status, json)
        return { ok: false, error: json?.message || `HTTP ${res.status}` }
      }
      return { ok: true }
    } catch (err: any) {
      console.error('Twilio request error:', err)
      return { ok: false, error: err.message }
    }
  },
}
