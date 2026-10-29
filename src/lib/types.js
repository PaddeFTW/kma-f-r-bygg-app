/** @typedef {import('./supabase').Company} Company */
/** @typedef {import('./supabase').Project} Project */
/** @typedef {import('./supabase').ProjectRole} ProjectRole */

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

/** Flik 1 – Projektbeskrivning (fält enligt underlaget) */
export const emptyProjectForm = {
  property_designation: '',
  address: '',
  postal_code: '',
  city: '',
  directions: '',
  contact_name: '',
  phone: '',
  email: '',
  contact_info: '',
  client_name: '',
  client_org_number: '',
  client_address: '',
  client_postal_code: '',
  client_city: '',
  client_phone: '',
  client_email: '',
  client_info: '',
  contractor_name: '',
  contractor_org_number: '',
  contractor_address: '',
  contractor_postal_code: '',
  contractor_city: '',
  contractor_project_manager: '',
  contractor_project_manager_phone: '',
  contractor_site_manager: '',
  contractor_site_manager_phone: '',
  contract_form: '',
  contractor_info: '',
  description: '',
}

/** Entreprenadform enligt Flik 1 / Flik 2: Total / Utförande */
export const contractForms = ['Total', 'Utförande']

/**
 * Roller enligt Flik 2 Organisation.
 * Minst: Projektchef, Arbetsledare, Platschef, KMA, Huvudskyddsombud.
 */
export const projectRoleTitles = [
  'Projektchef',
  'Arbetsledare',
  'Inköpsansvarig',
  'Platschef',
  'Konstruktionsansvarig',
  'Intern revisor',
  'KMA',
  'Administrationsansvarig',
  'Kontrollansvarig',
  'Huvudskyddsombud',
]

export const requiredProjectRoleTitles = [
  'Projektchef',
  'Arbetsledare',
  'Platschef',
  'KMA',
  'Huvudskyddsombud',
]

export const emptyProjectRoleForm = {
  role_title: '',
  name: '',
  phone: '',
  email: '',
  responsibility_area: '',
}

export function projectToForm(project) {
  if (!project) return { ...emptyProjectForm }
  return {
    property_designation: project.property_designation || '',
    address: project.address || '',
    postal_code: project.postal_code || '',
    city: project.city || '',
    directions: project.directions || '',
    contact_name: project.contact_name || '',
    phone: project.phone || '',
    email: project.email || '',
    contact_info: project.contact_info || '',
    client_name: project.client_name || '',
    client_org_number: project.client_org_number || '',
    client_address: project.client_address || '',
    client_postal_code: project.client_postal_code || '',
    client_city: project.client_city || '',
    client_phone: project.client_phone || '',
    client_email: project.client_email || '',
    client_info: project.client_info || '',
    contractor_name: project.contractor_name || '',
    contractor_org_number: project.contractor_org_number || '',
    contractor_address: project.contractor_address || '',
    contractor_postal_code: project.contractor_postal_code || '',
    contractor_city: project.contractor_city || '',
    contractor_project_manager: project.contractor_project_manager || '',
    contractor_project_manager_phone: project.contractor_project_manager_phone || '',
    contractor_site_manager: project.contractor_site_manager || '',
    contractor_site_manager_phone: project.contractor_site_manager_phone || '',
    contract_form: project.contract_form || '',
    contractor_info: project.contractor_info || '',
    description: project.description || '',
  }
}

/** Payload för insert/update – null för tomma valfria fält */
export function projectFormToPayload(form) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '')
  return {
    property_designation: t(form.property_designation),
    address: t(form.address) || null,
    postal_code: t(form.postal_code) || null,
    city: t(form.city) || null,
    directions: t(form.directions) || null,
    contact_name: t(form.contact_name) || null,
    phone: t(form.phone) || null,
    email: t(form.email) || null,
    contact_info: t(form.contact_info) || null,
    client_name: t(form.client_name) || null,
    client_org_number: t(form.client_org_number) || null,
    client_address: t(form.client_address) || null,
    client_postal_code: t(form.client_postal_code) || null,
    client_city: t(form.client_city) || null,
    client_phone: t(form.client_phone) || null,
    client_email: t(form.client_email) || null,
    client_info: t(form.client_info) || null,
    contractor_name: t(form.contractor_name) || null,
    contractor_org_number: t(form.contractor_org_number) || null,
    contractor_address: t(form.contractor_address) || null,
    contractor_postal_code: t(form.contractor_postal_code) || null,
    contractor_city: t(form.contractor_city) || null,
    contractor_project_manager: t(form.contractor_project_manager) || null,
    contractor_project_manager_phone: t(form.contractor_project_manager_phone) || null,
    contractor_site_manager: t(form.contractor_site_manager) || null,
    contractor_site_manager_phone: t(form.contractor_site_manager_phone) || null,
    contract_form: t(form.contract_form) || null,
    contractor_info: t(form.contractor_info) || null,
    description: t(form.description) || null,
  }
}

/**
 * Obligatoriska kontaktfält för huvudparter enligt underlaget.
 * Fastighetsbeteckning + kontakt på byggplats + byggherre + entreprenör.
 */
export function isProjectFormValid(form) {
  const required = [
    form.property_designation,
    form.contact_name,
    form.phone,
    form.email,
    form.client_name,
    form.client_org_number,
    form.client_address,
    form.client_postal_code,
    form.client_city,
    form.client_phone,
    form.client_email,
    form.contractor_name,
    form.contractor_org_number,
    form.contractor_address,
    form.contractor_postal_code,
    form.contractor_city,
    form.contractor_project_manager,
    form.contractor_project_manager_phone,
    form.contractor_site_manager,
    form.contractor_site_manager_phone,
    form.contract_form,
  ]
  return required.every((v) => typeof v === 'string' && v.trim().length > 0)
}
