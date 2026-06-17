'use client'
import { useState, useEffect } from 'react'
import { CreditCard, ArrowRight, ChevronDown, Lock, UserCircle } from 'lucide-react'
import FileUpload from '@/components/ui/FileUpload'
import { ID_OPTIONS, IdType } from '@/types'
import clsx from 'clsx'

export interface GuestEntry {
  guestName:  string
  idType:     IdType | ''
  idNumber:   string
  idFrontUrl: string | null
  idBackUrl:  string | null
}

function emptyGuest(name = ''): GuestEntry {
  return { guestName: name, idType: '', idNumber: '', idFrontUrl: null, idBackUrl: null }
}

function GuestCard({
  index, isPrimary, entry, onChange,
}: {
  index: number; isPrimary: boolean; entry: GuestEntry; onChange: (e: GuestEntry) => void
}) {
  const [open, setOpen] = useState(index === 0)
  const idCfg = ID_OPTIONS.find(o => o.value === entry.idType)
  const complete = !!(entry.guestName && entry.idType && entry.idNumber && entry.idFrontUrl)

  return (
    <div className={clsx('border rounded-xl overflow-hidden transition-all', {
      'border-brand/25 shadow-sm': open,
      'border-gray-100':           !open,
    })}>
      {/* Header row */}
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white text-left">
        <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors', {
          'bg-green-100 text-green-700': complete,
          'bg-brand text-white':         !complete && open,
          'bg-gray-100 text-gray-400':   !complete && !open,
        })}>
          {complete ? '✓' : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {entry.guestName || (isPrimary ? 'Primary guest' : `Guest ${index + 1}`)}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {entry.idType ? ID_OPTIONS.find(o => o.value === entry.idType)?.label : 'No ID selected'}
            {entry.idNumber ? ` · ${entry.idNumber}` : ''}
          </p>
        </div>
        {isPrimary && (
          <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium flex-shrink-0">
            Primary
          </span>
        )}
        <ChevronDown size={14} className={clsx('text-gray-400 flex-shrink-0 transition-transform', { 'rotate-180': open })} />
      </button>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-4 space-y-4">
          {/* Guest name */}
          <div>
            <label className="lbl">Full name as on ID <span className="text-red-400 normal-case font-normal">*</span></label>
            <div className="relative">
              <UserCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={entry.guestName}
                onChange={e => onChange({ ...entry, guestName: e.target.value })}
                className="inp pl-8"
                placeholder="Exactly as it appears on the document"
              />
            </div>
          </div>

          {/* ID type grid */}
          <div>
            <label className="lbl">Document type <span className="text-red-400 normal-case font-normal">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ID_OPTIONS.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => onChange({ ...entry, idType: opt.value, idNumber: '', idFrontUrl: null, idBackUrl: null })}
                  className={clsx('px-3 py-2.5 rounded-lg border text-xs font-medium text-left transition-all leading-snug', {
                    'border-brand bg-brand text-white shadow-sm': entry.idType === opt.value,
                    'border-gray-200 text-gray-600 hover:border-brand/30 hover:bg-gray-50': entry.idType !== opt.value,
                  })}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ID number + uploads — only after type selected */}
          {idCfg && (
            <>
              <div>
                <label className="lbl">{idCfg.numLabel} <span className="text-red-400 normal-case font-normal">*</span></label>
                <input
                  value={entry.idNumber}
                  onChange={e => onChange({ ...entry, idNumber: e.target.value.toUpperCase() })}
                  className="inp font-mono tracking-wider"
                  placeholder={idCfg.placeholder}
                />
              </div>

              <div className={clsx('grid gap-3', idCfg.hasBack ? 'grid-cols-2' : 'grid-cols-1')}>
                <FileUpload
                  label={`Front of ${idCfg.label}`}
                  hint="Clear, well-lit photo"
                  value={entry.idFrontUrl}
                  onChange={url => onChange({ ...entry, idFrontUrl: url })}
                />
                {idCfg.hasBack && (
                  <FileUpload
                    label={`Back of ${idCfg.label}`}
                    hint="Reverse side"
                    value={entry.idBackUrl}
                    onChange={url => onChange({ ...entry, idBackUrl: url })}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

interface Props {
  guestCount:      number
  primaryFirst:    string
  primaryLast:     string
  onChange:        (g: GuestEntry[]) => void
  onNext:          () => void
}

export default function Step3Guests({ guestCount, primaryFirst, primaryLast, onChange, onNext }: Props) {
  const [guests, setGuests] = useState<GuestEntry[]>(() =>
    Array.from({ length: guestCount }, (_, i) =>
      emptyGuest(i === 0 ? `${primaryFirst} ${primaryLast}`.trim() : '')
    )
  )

  // Resize guest list if guestCount changes
  useEffect(() => {
    setGuests(prev => {
      if (guestCount > prev.length) {
        return [...prev, ...Array.from({ length: guestCount - prev.length }, () => emptyGuest())]
      }
      return prev.slice(0, guestCount)
    })
  }, [guestCount])

  const update = (i: number, g: GuestEntry) => {
    const next = [...guests]; next[i] = g; setGuests(next); onChange(next)
  }

  const complete = guests.filter(g => g.guestName && g.idType && g.idNumber && g.idFrontUrl).length
  const allDone  = complete === guestCount

  return (
    <div className="card">
      <div className="card-head">
        <div className="c-icon"><CreditCard size={14} className="text-white" /></div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Guest identity verification</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {guestCount} guest{guestCount > 1 ? 's' : ''} · one valid ID required each
          </p>
        </div>
        <span className="text-[10px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 font-medium">3 of 4</span>
      </div>

      <div className="p-5 space-y-3">
        {/* Security notice */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-3">
          <Lock size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-600 leading-relaxed">
            All documents are encrypted in transit and stored securely.
            Required under Form C regulations for guest accommodation in India.
            Never shared with third parties.
          </p>
        </div>

        {guests.map((g, i) => (
          <GuestCard key={i} index={i} isPrimary={i === 0} entry={g} onChange={e => update(i, e)} />
        ))}

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-gray-400">
            <span className={clsx('font-semibold', allDone ? 'text-green-600' : 'text-gray-600')}>{complete}</span>
            /{guestCount} complete
          </p>
          <button type="button" onClick={onNext} disabled={!allDone} className="btn-brand">
            Continue <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
