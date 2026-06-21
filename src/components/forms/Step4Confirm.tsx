'use client'
import { useState } from 'react'
import { CheckCircle, Send, Shield, FileText, Users, EyeOff } from 'lucide-react'
import { ID_LABELS, BOOKING_SOURCE_LABELS, BookingSource } from '@/types'
import clsx from 'clsx'

export default function Step4Confirm({ data, onSubmit, loading }: { data: any; onSubmit: () => void; loading: boolean }) {
  const [agreed, setAgreed] = useState({ a: false, b: false, c: false })
  const allAgreed = agreed.a && agreed.b && agreed.c
  const sourceLabel = data.bookingSource ? BOOKING_SOURCE_LABELS[data.bookingSource as BookingSource] : ''

  return (
    <div className="card">
      <div className="card-head">
        <div className="c-icon"><CheckCircle size={14} className="text-white" /></div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Review &amp; confirm</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Check your details before submitting</p>
        </div>
        <span className="text-[10px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 font-medium">4 of 4</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { lbl: 'Guest',    v1: `${data.firstName} ${data.lastName}`, v2: data.email },
            { lbl: 'Dates',    v1: data.checkinDate,                      v2: `to ${data.checkoutDate}` },
            { lbl: sourceLabel || 'Booking', v1: data.bookingId || '—',   v2: `${data.guestCount} guest${data.guestCount > 1 ? 's' : ''}` },
          ].map(({ lbl, v1, v2 }) => (
            <div key={lbl} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mb-1">{lbl}</p>
              <p className="text-xs font-semibold text-gray-900 leading-snug truncate">{v1}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{v2}</p>
            </div>
          ))}
        </div>

        {/* Guest ID summary */}
        {data.guests?.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
              <Users size={12} className="text-gray-400" />
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Guest IDs submitted</p>
            </div>
            {data.guests.map((g: any, i: number) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-b-0 bg-white">
                <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-[9px] font-bold text-brand flex-shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800">{g.guestName}</p>
                  <p className="text-[10px] text-gray-400">{g.idType ? ID_LABELS[g.idType as keyof typeof ID_LABELS] : ''} · {g.idNumber}</p>
                </div>
                <div className="flex items-center gap-1 text-green-600 text-[10px]">
                  <CheckCircle size={11} /> Ready
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Consent */}
        <div className="space-y-3 pt-1">
          {[
            { k: 'a', text: 'All information I have provided is accurate and complete.' },
            { k: 'b', text: <>I agree to the <a href="#" className="text-brand underline">house rules</a> of Staycation21 — quiet hours (10 PM–7 AM), no-smoking policy, and damage liability.</> },
            { k: 'c', text: <>I consent to my documents being stored securely for regulatory compliance per the <a href="#" className="text-brand underline">privacy policy</a>.</> },
          ].map(({ k, text }) => (
            <label key={k} className="flex items-start gap-3 cursor-pointer group">
              <div onClick={() => setAgreed(p => ({ ...p, [k]: !p[k as 'a'|'b'|'c'] }))}
                className={clsx('w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all', {
                  'bg-brand border-brand': agreed[k as 'a'|'b'|'c'],
                  'border-gray-300 group-hover:border-brand/40': !agreed[k as 'a'|'b'|'c'],
                })}>
                {agreed[k as 'a'|'b'|'c'] && <CheckCircle size={10} className="text-white" />}
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed">{text}</p>
            </label>
          ))}
        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-3 gap-2 py-1">
          {[[Shield,'Encrypted'],[FileText,'Form C compliant'],[EyeOff,'Zero sharing']].map(([Icon, t]: any) => (
            <div key={t} className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <Icon size={11} className="text-gray-300 flex-shrink-0" />{t}
            </div>
          ))}
        </div>

        <button type="button" onClick={onSubmit} disabled={!allAgreed || loading} className="btn-brand w-full py-3">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
            : <><Send size={14} /> Submit check-in</>}
        </button>
      </div>
    </div>
  )
}
