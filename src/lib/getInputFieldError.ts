/**
 * Shape of a server-action result that carries field-level validation errors.
 * `errors` is a map of field-name → message (matches the ActionState returned
 * by the menu management server actions). The whole state may be null before
 * the action has run for the first time (useActionState initial value).
 */
export interface IInputErrorState {
  success: boolean
  message?: string
  formData?: Record<string, unknown>
  errors?: Partial<Record<string, string>>
}

export const getInputFieldError = (fieldName: string, state: IInputErrorState | null | undefined): string | null => {
  return state?.errors?.[fieldName] ?? null
}

export default getInputFieldError
