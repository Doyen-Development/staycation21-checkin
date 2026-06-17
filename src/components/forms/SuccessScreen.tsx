'use client'
import { CheckCircle, MessageCircle } from 'lucide-react'

export default function SuccessScreen({ name }: { name: string }) {
  return (
    <div className="card mt-4">
      <div className="p-10 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={26} className="text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          You're all checked in{name ? `, ${name}` : ''}!
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto mb-7">
          We've received your details and verified your ID. A confirmation email is on its way. We'll send your welcome message and entry instructions before your arrival.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <MessageCircle size={15} /> WhatsApp us for any queries
        </a>
      </div>
    </div>
  )
}
