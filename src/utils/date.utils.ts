/**
 * Calculate years buried based on interment date
 * @param intermentDate - The interment date string (e.g., "2023-08-15")
 * @returns String representation of years buried
 */
export const calculateYearsBuried = (intermentDate: string): string => {
  if (!intermentDate) return 'N/A'

  try {
    const intermentYear = new Date(intermentDate).getFullYear()
    const currentYear = new Date().getFullYear()
    const yearsDiff = currentYear - intermentYear

    if (yearsDiff < 0) {
      return 'Less than a year'
    } else if (yearsDiff === 0) {
      return 'Less than a year'
    } else if (yearsDiff === 1) {
      return '1 year'
    } else {
      return `${yearsDiff} years`
    }
  } catch (error) {
    console.error('Error calculating years buried:', error)
    return 'N/A'
  }
}

/**
 * Format date to readable string
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}
