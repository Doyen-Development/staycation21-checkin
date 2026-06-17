'use client'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ArrowRight, User } from 'lucide-react'

interface Props {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  onNext: () => void
}

export default function Step1Personal({ register, errors, onNext }: Props) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="c-icon"><User size={14} className="text-white" /></div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Personal information</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Primary guest details</p>
        </div>
        <span className="text-[10px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 font-medium">1 of 4</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="lbl">First name <span className="text-red-400 normal-case font-normal">*</span></label>
            <input {...register('firstName', { required: 'Required' })} className="inp" placeholder="Rahul" />
            {errors.firstName && <p className="err">{errors.firstName.message as string}</p>}
          </div>
          <div>
            <label className="lbl">Last name <span className="text-red-400 normal-case font-normal">*</span></label>
            <input {...register('lastName', { required: 'Required' })} className="inp" placeholder="Sharma" />
            {errors.lastName && <p className="err">{errors.lastName.message as string}</p>}
          </div>
        </div>
        <div>
          <label className="lbl">Email address <span className="text-red-400 normal-case font-normal">*</span></label>
          <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" className="inp" placeholder="rahul@email.com" />
          <p className="text-[10px] text-gray-400 mt-1">Confirmation will be sent here</p>
          {errors.email && <p className="err">{errors.email.message as string}</p>}
        </div>
        <div>
          <label className="lbl">Mobile number <span className="text-red-400 normal-case font-normal">*</span></label>
          <input {...register('phone', { required: 'Required' })} type="tel" className="inp" placeholder="+91 98765 43210" />
          <p className="text-[10px] text-gray-400 mt-1">WhatsApp preferred</p>
          {errors.phone && <p className="err">{errors.phone.message as string}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="lbl">City</label>
            <input {...register('city')} className="inp" placeholder="Delhi" />
          </div>
          <div>
            <label className="lbl">State</label>
            <input {...register('state')} className="inp" placeholder="Haryana" />
          </div>
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
