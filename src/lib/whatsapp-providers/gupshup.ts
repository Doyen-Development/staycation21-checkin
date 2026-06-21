// Gupshup WhatsApp Business API provider
// Docs: https://docs.gupshup.io/docs/template-messages
//
// Setup:
// 1. Create account at gupshup.io, complete WhatsApp Business verification
//    (works with a NEW dedicated number — see README for using an existing number)
// 2. Create a message template (Message Templates → Create), e.g body:
//    "Hi {{1}}, your check-in for {{2}} is confirmed for {{3}}. Check-out: {{4}}.
//     Guests: {{5}}. Booking ref: {{6}}. Reply here if you need anything."
// 3. Submit for Meta approval (1-3 days)
// 4. Set env vars: GUPSHUP_API_KEY, GUPSHUP_SOURCE_NUMBER, GUPSHUP_TEMPLATE_ID, GUPSHUP_APP_NAME

import { WhatsAppProvider, WhatsAppConfirmationData, WhatsAppResult, normalizePhone } from './types'

export const gupshupProvider: WhatsAppProvider = {
  name: 'gupshup',

  isConfigured() {
    return !!(process.env.GUPSHUP_API_KEY && process.env.GUPSHUP_SOURCE_NUMBER && process.env.GUPSHUP_TEMPLATE_ID)
  },

  async send(data: WhatsAppConfirmationData): Promise<WhatsAppResult> {
    const apiKey     = process.env.GUPSHUP_API_KEY!
    const source     = process.env.GUPSHUP_SOURCE_NUMBER!
    const templateId = process.env.GUPSHUP_TEMPLATE_ID!
    const srcName    = process.env.GUPSHUP_APP_NAME || data.propertyName || 'Staycation21'

    const destination = normalizePhone(data.phone)

    // Params must match the {{1}}, {{2}}... order in your approved template exactly
    const templateParams = [
      data.firstName,
      data.propertyName || 'Staycation21',
      data.checkinDate,
      data.checkoutDate,
      String(data.guestCount),
      data.bookingId || 'N/A',
    ]

    try {
      const body = new URLSearchParams({
        source,
        destination,
        'src.name': srcName,
        template: JSON.stringify({ id: templateId, params: templateParams }),
      })

      const res = await fetch('https://api.gupshup.io/wa/api/v1/template/msg', {
        method: 'POST',
        headers: {
          apikey: apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        console.error('Gupshup send failed:', res.status, json)
        return { ok: false, error: json?.message || `HTTP ${res.status}` }
      }
      return { ok: true }
    } catch (err: any) {
      console.error('Gupshup request error:', err)
      return { ok: false, error: err.message }
    }
  },
}
