// Shared contract every WhatsApp provider must implement.
// This lets the rest of the app call sendWhatsAppConfirmation() without
// caring which provider a given customer/deployment has configured.

export interface WhatsAppConfirmationData {
  firstName:    string
  phone:        string
  checkinDate:  string
  checkoutDate: string
  guestCount:   number
  bookingId?:   string
  propertyName?: string
}

export interface WhatsAppResult {
  ok: boolean
  error?: string
}

export interface WhatsAppProvider {
  name: string
  isConfigured(): boolean
  send(data: WhatsAppConfirmationData): Promise<WhatsAppResult>
}

export function normalizePhone(phone: string): string {
  // Converts any common Indian phone format to E.164-without-plus,
  // which is what most WhatsApp BSPs (Gupshup, Twilio, etc.) expect.
  // "+91 98765 43210" / "098765 43210" / "9876543210" -> "919876543210"
  let digits = phone.replace(/[^\d]/g, '')
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  if (digits.length === 10) digits = '91' + digits
  return digits
}
