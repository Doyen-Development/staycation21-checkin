export type IdType = 'aadhaar' | 'passport' | 'driving_licence' | 'voter_id' | 'pan'
export type CheckinStatus = 'pending' | 'verified' | 'checked_in' | 'checked_out'
export type BookingSource = 'airbnb' | 'booking_com' | 'makemytrip' | 'goibibo' | 'oyo' | 'direct' | 'other'

export const BOOKING_SOURCE_OPTIONS: { value: BookingSource; label: string; idLabel: string; placeholder: string }[] = [
  { value: 'airbnb',      label: 'Airbnb',         idLabel: 'Airbnb booking ID',       placeholder: 'HM1234XYZ789' },
  { value: 'booking_com', label: 'Booking.com',    idLabel: 'Booking.com confirmation No.', placeholder: '1234567890' },
  { value: 'makemytrip',  label: 'MakeMyTrip',     idLabel: 'MakeMyTrip booking ID',   placeholder: 'NH12345678' },
  { value: 'goibibo',     label: 'Goibibo',        idLabel: 'Goibibo booking ID',      placeholder: 'GO1234567' },
  { value: 'oyo',         label: 'OYO',            idLabel: 'OYO booking ID',          placeholder: 'OYO1234567' },
  { value: 'direct',      label: 'Direct / Walk-in', idLabel: 'Reference / phone number', placeholder: 'Optional' },
  { value: 'other',       label: 'Other',          idLabel: 'Booking reference',       placeholder: 'Enter reference' },
]

export const BOOKING_SOURCE_LABELS: Record<BookingSource, string> = {
  airbnb: 'Airbnb', booking_com: 'Booking.com', makemytrip: 'MakeMyTrip',
  goibibo: 'Goibibo', oyo: 'OYO', direct: 'Direct / Walk-in', other: 'Other',
}

export const ID_OPTIONS = [
  { value: 'aadhaar'         as IdType, label: 'Aadhaar Card',    hasBack: true,  numLabel: 'Aadhaar number',   placeholder: 'XXXX XXXX XXXX' },
  { value: 'passport'        as IdType, label: 'Passport',         hasBack: true,  numLabel: 'Passport number',  placeholder: 'A1234567' },
  { value: 'driving_licence' as IdType, label: 'Driving Licence',  hasBack: true,  numLabel: 'Licence number',   placeholder: 'DL-XXXXXXXXXX' },
  { value: 'voter_id'        as IdType, label: 'Voter ID',         hasBack: true,  numLabel: 'Voter ID number',  placeholder: 'XXXXXXXXXX' },
  { value: 'pan'             as IdType, label: 'PAN Card',         hasBack: false, numLabel: 'PAN number',       placeholder: 'ABCDE1234F' },
]

export const ID_LABELS: Record<IdType, string> = {
  aadhaar: 'Aadhaar Card', passport: 'Passport',
  driving_licence: 'Driving Licence', voter_id: 'Voter ID', pan: 'PAN Card',
}

export const PURPOSE_OPTIONS = [
  'Leisure / vacation','Family gathering','Friends outing',
  'Work / remote stay','Celebration or event','Other',
]

export const STATUS_CONFIG: Record<CheckinStatus, { label: string; cls: string }> = {
  pending:     { label: 'Pending',     cls: 'bg-amber-100 text-amber-700' },
  verified:    { label: 'Verified',    cls: 'bg-blue-100 text-blue-700' },
  checked_in:  { label: 'Checked in',  cls: 'bg-green-100 text-green-700' },
  checked_out: { label: 'Checked out', cls: 'bg-gray-100 text-gray-500' },
}
