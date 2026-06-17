export type IdType = 'aadhaar' | 'passport' | 'driving_licence' | 'voter_id' | 'pan'
export type CheckinStatus = 'pending' | 'verified' | 'checked_in' | 'checked_out'

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
