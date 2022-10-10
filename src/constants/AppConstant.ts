export const BreakPoints = Object.freeze({
  mobile: 600,
  tablet: 900,
  laptop: 1024,
  desktop: 1200
})

export const DAY_IN_SECOND = 24 * 60 * 60

export const MONTH_IN_SECOND = 31 * 24 * 60 * 60

export const DEFAULT_FORMATTER = 'YYYY-MM-DD HH:mm'

export const DEFAULT_FORMATTER_SECOND_TIME = 'YYYY-MM-DD HH:mm:ss'

export const USER_ROLE = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' }
]

export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i