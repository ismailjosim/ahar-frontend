import { ZodType, z } from "zod"

// Define proper return types
type ValidationSuccess<T> = {
  success: true
  data: T
}

type ValidationError = {
  success: false
  type: "validation"
  message: string
  errors: Array<{
    field: string
    message: string
  }>
}

type ValidationResult<T> = ValidationSuccess<T> | ValidationError

export const zodValidator = <T extends ZodType>(payload: unknown, schema: T): ValidationResult<z.output<T>> => {
  const validatePayload = schema.safeParse(payload)

  if (!validatePayload.success) {
    return {
      success: false,
      type: "validation" as const,
      message: "Validation failed",
      errors: validatePayload.error.issues.map((issue) => ({
        field: issue.path[0] as string,
        message: issue.message,
      })),
    }
  }

  return {
    success: true,
    data: validatePayload.data,
  }
}
