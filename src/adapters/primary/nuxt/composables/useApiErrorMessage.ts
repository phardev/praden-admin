export interface ApiErrorMessage {
  title: string
  message?: string
}

export interface ErrorWithResponse {
  response?: {
    status: number
    data: unknown
  }
}

const uniqueConstraintFields = (errors: string): Array<string> | undefined => {
  const match = errors.match(
    /Unique constraint failed on the fields?: \((.*?)\)/
  )
  if (!match || !match[1]) return undefined
  return match[1].split(',').map((field) => field.trim().replace(/[`'"]+/g, ''))
}

const validationTypeOf = (
  message: string
): { type: string; params: Record<string, string> } => {
  if (message.includes('required')) return { type: 'required', params: {} }
  const greaterOrEqual = message.match(
    /must be greater than or equal to (-?\d+)/i
  )
  if (greaterOrEqual) return { type: 'gte', params: { min: greaterOrEqual[1] } }
  const greater = message.match(/must be greater than (-?\d+)/i)
  if (greater) return { type: 'gt', params: { min: greater[1] } }
  if (message.includes('not instance of file')) {
    return { type: 'file', params: {} }
  }
  return { type: '', params: {} }
}

export const useApiErrorMessage = () => {
  const { t } = useI18n()

  const translateFieldError = (error: string): string => {
    const parts = error.split(':').map((part: string) => part.trim())
    if (parts.length !== 2) return error
    const { type, params } = validationTypeOf(parts[1].toLowerCase())
    const translationKey = `validation.${parts[0]}.${type}`
    const translation = t(translationKey, params)
    return translation !== translationKey ? translation : error
  }

  const translateValidationErrors = (errors: unknown): string => {
    if (typeof errors === 'string') {
      const fields = uniqueConstraintFields(errors)
      if (!fields) return errors
      return fields
        .map((field) => t(`validation.${field}.unique`, { field }))
        .join('\n')
    }
    if (!Array.isArray(errors)) return String(errors)
    return errors.map(translateFieldError).join('\n')
  }

  const fromError = (error: ErrorWithResponse): ApiErrorMessage => {
    if (!error.response) return { title: t('error.unknown') }
    switch (error.response.status) {
      case 400:
        return {
          title: t('error.badRequest'),
          message: translateValidationErrors(error.response.data)
        }
      case 401:
        return { title: t('error.unauthorized') }
      case 404:
        return { title: t('error.notFound') }
      case 500:
        return { title: t('error.internal') }
      default:
        return { title: t('error.unknown') }
    }
  }

  return { fromError }
}
