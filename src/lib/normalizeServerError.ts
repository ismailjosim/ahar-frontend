/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IActionState {
  success: boolean
  message?: string
  errors?: Record<string, string>
}

export const normalizeServerError = (result: any): IActionState => {
  const state: IActionState = {
    success: false,
    message: result?.message || "Something went wrong. Please try again.",
    errors: {},
  }

  if (Array.isArray(result?.errorDetails)) {
    const errorMap: Record<string, string> = {}
    result.errorDetails.forEach((err: any) => {
      if (err.path && err.message) {
        errorMap[err.path] = err.message
      }
    })
    state.errors = errorMap
  }

  return state
}
