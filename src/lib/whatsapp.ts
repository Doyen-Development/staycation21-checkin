// WhatsApp confirmation dispatcher — sends a check-in confirmation message
// via whichever provider this deployment has configured.
//
// Why this exists: different customers will have different WhatsApp setups
// (some already on Twilio, some on Gupshup, some with no WhatsApp API yet).
// Instead of hardcoding one provider, this file picks one at runtime based
// on the WHATSAPP_PROVIDER env var. Adding a new provider later means:
//   1. Create src/lib/whatsapp-providers/yourprovider.ts implementing WhatsAppProvider
//   2. Add it to the `providers` map below
//   3. Set WHATSAPP_PROVIDER=yourprovider in env vars
// No changes needed anywhere else in the app.

import { WhatsAppProvider, WhatsAppConfirmationData, WhatsAppResult } from './whatsapp-providers/types'
import { gupshupProvider } from './whatsapp-providers/gupshup'
import { twilioProvider } from './whatsapp-providers/twilio'
import { noneProvider } from './whatsapp-providers/none'

const providers: Record<string, WhatsAppProvider> = {
  gupshup: gupshupProvider,
  twilio:  twilioProvider,
  none:    noneProvider,
}

function getActiveProvider(): WhatsAppProvider {
  const selected = process.env.WHATSAPP_PROVIDER?.toLowerCase() || 'none'
  const provider = providers[selected]

  if (!provider) {
    console.warn(`Unknown WHATSAPP_PROVIDER "${selected}" — falling back to none`)
    return noneProvider
  }
  return provider
}

export async function sendWhatsAppConfirmation(data: WhatsAppConfirmationData): Promise<WhatsAppResult> {
  const provider = getActiveProvider()

  if (provider.name !== 'none' && !provider.isConfigured()) {
    console.warn(`WhatsApp provider "${provider.name}" selected but missing required env vars — skipping`)
    return { ok: false, error: `${provider.name} not fully configured` }
  }

  return provider.send(data)
}

export type { WhatsAppConfirmationData, WhatsAppResult } from './whatsapp-providers/types'
