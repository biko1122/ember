/**
 * Form validation helpers.
 *
 * Each `validate*` function takes the form values and returns an object of
 * `{ fieldName: 'message' }`. An empty object means the form is valid, which
 * makes the calling component read as:
 *
 *   const errors = validateSignup(values)
 *   if (Object.keys(errors).length > 0) return setErrors(errors)
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Egyptian mobile numbers: 01 followed by 9 digits, optionally +20 prefixed.
const PHONE_PATTERN = /^(?:\+?20)?0?1[0125]\d{8}$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

export function isValidPhone(value) {
  return PHONE_PATTERN.test(value.replace(/[\s-]/g, ''))
}

export function validateLogin({ identifier, password }) {
  const errors = {}

  if (!identifier.trim()) {
    errors.identifier = 'Enter your email or phone number.'
  } else if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
    errors.identifier = 'That does not look like a valid email or phone number.'
  }

  if (!password) {
    errors.password = 'Enter your password.'
  }

  return errors
}

export function validateSignup(values) {
  const errors = {}

  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!isValidPhone(values.phone)) {
    errors.phone = 'Enter a valid Egyptian mobile number, e.g. 01012345678.'
  }

  if (!values.password) {
    errors.password = 'Choose a password.'
  } else if (values.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = 'Please accept the Terms & Conditions to continue.'
  }

  return errors
}

export function validateCustomerDetails({ fullName, phone, email }) {
  const errors = {}

  if (!fullName.trim()) {
    errors.fullName = 'Tell us who the order is for.'
  }

  if (!phone.trim()) {
    errors.phone = 'We need a phone number to reach you.'
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Enter a valid Egyptian mobile number.'
  }

  if (email.trim() && !isValidEmail(email)) {
    errors.email = 'Enter a valid email address, or leave it blank.'
  }

  return errors
}

export function validateDeliveryAddress({ area, street, building }) {
  const errors = {}

  if (!area.trim()) errors.area = 'Choose the area you are in.'
  if (!street.trim()) errors.street = 'Street name is required.'
  if (!building.trim()) errors.building = 'Building name or number is required.'

  return errors
}
