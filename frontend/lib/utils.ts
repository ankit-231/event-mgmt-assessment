import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FieldValues, Path, UseFormSetError } from "react-hook-form"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Applies field-level errors from a DRF `extra.fields` error payload onto a
 * react-hook-form form. Returns the `non_field_errors` (if any) so the
 * caller can render them as a form-level message.
 */
export function setFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fields: Record<string, string[]> | undefined
): string | undefined {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return undefined
  }

  let nonFieldErrors: string | undefined

  Object.keys(fields).forEach((fieldName) => {
    const fieldErrors = fields[fieldName]
    if (!Array.isArray(fieldErrors) || fieldErrors.length === 0) return

    if (fieldName === "non_field_errors") {
      nonFieldErrors = fieldErrors.join(" ")
      return
    }

    setError(fieldName as Path<T>, {
      type: "manual",
      message: fieldErrors.join(" "),
    })
  })

  return nonFieldErrors
}
