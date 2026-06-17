'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import StepBar     from '@/components/ui/StepBar'
import Step1Personal from './Step1Personal'
import Step2Stay     from './Step2Stay'
import Step3Guests, { GuestEntry } from './Step3Guests'
import Step4Confirm  from './Step4Confirm'
import SuccessScreen from './SuccessScreen'

export default function CheckinFlow() {
  const [step, setStep]         = useState(0)
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [guests, setGuests]     = useState<GuestEntry[]>([])

  const form = useForm({ defaultValues: { guestCount: 2 } })
  const { register, handleSubmit, watch, setValue, getValues, trigger, formState: { errors } } = form

  const next = async (fields: string[]) => {
    const ok = await trigger(fields as any)
    if (ok) setStep(s => s + 1)
  }

  const submit = async () => {
    setLoading(true)
    try {
      const values = getValues()
      const res = await fetch('/api/checkin', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...values, guests }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setDone(true)
    } catch (e) {
      alert('Something went wrong — please try again or contact us on WhatsApp.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (done) return <SuccessScreen name={getValues('firstName')} />

  const guestCount = watch('guestCount') || 1
  const v          = getValues()

  return (
    <div>
      <StepBar current={step} />
      <div className="space-y-4 mt-4">
        {step === 0 && (
          <Step1Personal register={register} errors={errors}
            onNext={() => next(['firstName','lastName','email','phone'])} />
        )}
        {step === 1 && (
          <Step2Stay register={register} errors={errors} watch={watch} setValue={setValue}
            onNext={() => next(['checkinDate','checkoutDate','airbnbBookingId'])} />
        )}
        {step === 2 && (
          <Step3Guests
            guestCount={guestCount}
            primaryFirst={v.firstName || ''} primaryLast={v.lastName || ''}
            onChange={setGuests}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step4Confirm
            data={{ ...v, guests }}
            onSubmit={submit}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
