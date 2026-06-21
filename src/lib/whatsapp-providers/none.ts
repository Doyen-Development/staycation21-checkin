// No-op provider — used when no WhatsApp provider is configured for this
// deployment. Lets the rest of the app call sendWhatsAppConfirmation()
// unconditionally without crashing when a customer hasn't set up WhatsApp yet.

import { WhatsAppProvider, WhatsAppResult } from './types'

export const noneProvider: WhatsAppProvider = {
  name: 'none',
  isConfigured() { return true }, // always "configured" — it just does nothing
  async send(): Promise<WhatsAppResult> {
    return { ok: false, error: 'No WhatsApp provider configured (WHATSAPP_PROVIDER unset)' }
  },
}
