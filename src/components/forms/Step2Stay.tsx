'use client'
import { ArrowRight, Calendar, Minus, Plus } from 'lucide-react'
import { PURPOSE_OPTIONS, BOOKING_SOURCE_OPTIONS, BookingSource } from '@/types'

interface Props {
  register: any; errors: any; watch: any; setValue: any; onNext: () => void
}

export default function Step2Stay({ register, errors, watch, setValue, onNext }: Props) {
  const guestCount = watch('guestCount') || 1
  const bookingSource: BookingSource = watch('bookingSource') || 'airbnb'
  const sourceConfig = BOOKING_SOURCE_OPTIONS.find(o => o.value === bookingSource) || BOOKING_SOURCE_OPTIONS[0]
  const idRequired = bookingSource !== 'direct'

  return (
    <div className="card">
      <div className="card-head">
        <div className="c-icon"><Calendar size={14} className="text-white" /></div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Stay details</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Booking and group info</p>
        </div>
        <span className="text-[10px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 font-medium">2 of 4</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="lbl">Check-in date <span className="text-red-400 normal-case font-normal">*</span></label>
            <input {...register('checkinDate', { required: 'Required' })} type="date" className="inp" />
            {errors.checkinDate && <p className="err">{errors.checkinDate.message as string}</p>}
          </div>
          <div>
            <label className="lbl">Check-out date <span className="text-red-400 normal-case font-normal">*</span></label>
            <input {...register('checkoutDate', { required: 'Required' })} type="date" className="inp" />
            {errors.checkoutDate && <p className="err">{errors.checkoutDate.message as string}</p>}
          </div>
        </div>

        {/* Where did you book? */}
        <div>
          <label className="lbl">Where did you book? <span className="text-red-400 normal-case font-normal">*</span></label>
          <select {...register('bookingSource', { required: 'Required' })} className="inp" defaultValue="airbnb">
            {BOOKING_SOURCE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="lbl">
            {sourceConfig.idLabel} {idRequired && <span className="text-red-400 normal-case font-normal">*</span>}
          </label>
          <input
            {...register('bookingId', { required: idRequired ? 'Required' : false })}
            className="inp font-mono tracking-wide"
            placeholder={sourceConfig.placeholder}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            {bookingSource === 'direct'
              ? 'Optional — leave blank if you booked directly with us'
              : `Found in your ${sourceConfig.label} confirmation email`}
          </p>
          {errors.bookingId && <p className="err">{errors.bookingId.message as string}</p>}
        </div>

        <div>
          <label className="lbl">Purpose of visit</label>
          <select {...register('purposeOfVisit')} className="inp">
            <option value="">Select one</option>
            {PURPOSE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Guest counter */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-800">Number of guests</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Adults and children combined</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setValue('guestCount', Math.max(1, guestCount - 1))}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-brand/50 hover:text-brand transition-colors">
              <Minus size={13} />
            </button>
            <span className="text-lg font-semibold text-gray-900 min-w-[20px] text-center">{guestCount}</span>
            <button type="button" onClick={() => setValue('guestCount', Math.min(20, guestCount + 1))}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-brand/50 hover:text-brand transition-colors">
              <Plus size={13} />
            </button>
          </div>
        </div>

        <div>
          <label className="lbl">Special requests <span className="normal-case font-normal text-gray-300">(optional)</span></label>
          <textarea {...register('specialRequests')} className="inp resize-none h-[72px]" placeholder="Early check-in, dietary needs, celebration setup..." />
        </div>

        <div className="flex justify-end pt-1">
          <button type="button" onClick={onNext} className="btn-brand">
            Continue <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
