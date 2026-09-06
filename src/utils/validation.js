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

/** What a password has to clear before an account can be created. */
export const PASSWORD_RULES = {
  minLength: 8,
  description: 'At least 8 characters, with a letter and a number.',
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

export function isValidPhone(value) {
  return PHONE_PATTERN.test(value.replace(/[\s-]/g, ''))
}

/** The message for a password that fails the rules, or null when it passes. */
export function getPasswordError(password) {
  if (!password) return 'Choose a password.'
  if (password.length < PASSWORD_RULES.minLength) {
    return `Use at least ${PASSWORD_RULES.minLength} characters.`
  }
  if (!/[a-zA-Z]/.test(password)) return 'Include at least one letter.'
  if (!/\d/.test(password)) return 'Include at least one number.'
  return null
}

/**
 * Rough strength, for the meter under the sign-up password field.
 * Deliberately simple and honest: it counts length and variety, and it is a
 * hint to the customer rather than a gate — `getPasswordError` is the gate.
 */
export function scorePassword(password = '') {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password) && /[^\w\s]/.test(password)) score += 1

  // A short password never looks good, however varied it is.
  if (password.length < 8) score = Math.min(score, 1)

  const levels = [
    { level: 'weak', label: 'Weak', advice: 'add a few more characters' },
    { level: 'weak', label: 'Weak', advice: 'add a few more characters' },
    { level: 'fair', label: 'Fair', advice: 'mix in capitals or a symbol' },
    { level: 'good', label: 'Good', advice: 'add a symbol to finish it off' },
    { level: 'strong', label: 'Strong', advice: null },
  ]

  return { score, ...levels[score] }
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

  const passwordError = getPasswordError(values.password)
  if (passwordError) errors.password = passwordError

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Type your password again to confirm it.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = 'Please accept the Terms & Conditions to continue.'
  }

  return errors
}

/** The account page's change-password form. */
export function validatePasswordChange({ currentPassword, newPassword, confirmPassword }) {
  const errors = {}

  if (!currentPassword) errors.currentPassword = 'Enter your current password.'

  const passwordError = getPasswordError(newPassword)
  if (passwordError) {
    errors.newPassword = passwordError
  } else if (newPassword === currentPassword) {
    errors.newPassword = 'Choose a password you have not used here before.'
  }

  if (confirmPassword !== newPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

/** The "forgot your password" form. */
export function validatePasswordReset({ email }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Enter the email on your account.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.'
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
