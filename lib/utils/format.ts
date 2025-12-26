export function formatBusinessNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, '')
  
  if (numbers.length <= 3) {
    return numbers
  }
  if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`
}

export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, '')
  
  if (numbers.length <= 3) {
    return numbers
  }
  if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

export function unformatNumber(value: string): string {
  return value.replace(/[^\d]/g, '')
}





