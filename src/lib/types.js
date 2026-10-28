/** @typedef {import('./supabase').Company} Company */
/** @typedef {import('./supabase').Project} Project */

export const emptyCompanyForm = {
  name: '',
  org_number: '',
  address: '',
  postal_code: '',
  city: '',
  ceo_name: '',
  phone: '',
  email: '',
  website: '',
}

export const emptyProjectForm = {
  property_designation: '',
  address: '',
  postal_code: '',
  city: '',
  contact_name: '',
  phone: '',
  email: '',
  client_name: '',
  contractor_name: '',
  contract_form: '',
  description: '',
}

export const contractForms = [
  'Totalentreprenad',
  'Generalentreprenad',
  'Delad entreprenad',
  'Utförandeentreprenad',
  'Partnering',
  'Annat',
]
