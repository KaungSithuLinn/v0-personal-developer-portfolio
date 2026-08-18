"use client"

import { useCallback, useState, useRef } from "react"
import { z } from "zod"
import { getErrorMessage } from "@/lib/action-utils"
import { useTranslation } from "@/context/language-utils"

interface I18nFormOptions<T> {
  initialValues: T
  validationSchema: z.ZodObject<any>
  onSubmit: (_values: T) => Promise<void> | void
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

interface I18nFormState<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

type I18nFormHandlers = {
  handleChange: (_e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (_e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (_e: React.FormEvent) => void
  setFieldValue: (_field: string, _value: any) => void
  setFieldTouched: (_field: string, _touched?: boolean) => void
  resetForm: () => void
  validateField: (_field: string) => void
  validateForm: () => boolean
}

export function useI18nForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: I18nFormOptions<T>) {
  const { language } = useTranslation()
  const valuesRef = useRef<T>(initialValues)
  const [state, setState] = useState<I18nFormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  })

  const validateField = useCallback(
    (field: string) => {
      try {
        const schema = validationSchema.pick({ [field]: true })
        schema.parse({ [field]: valuesRef.current[field] })
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: "",
          },
        }))
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.issues[0]
          setState((prev) => ({
            ...prev,
            errors: {
              ...prev.errors,
              [field]: getErrorMessage(fieldError.message, language),
            },
          }))
          return false
        }
        return true
      }
    },
    [validationSchema, language]
  )

  const validateForm = useCallback(() => {
    try {
      validationSchema.parse(valuesRef.current)
      setState((prev) => ({
        ...prev,
        errors: {},
        isValid: true,
      }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          const field = err.path[0] as string
          newErrors[field] = getErrorMessage(err.message, language)
        })
        setState((prev) => ({
          ...prev,
          errors: newErrors,
          isValid: false,
        }))
        return false
      }
      return true
    }
  }, [validationSchema, language])

  const handlers: I18nFormHandlers = {
    handleChange: (e) => {
      const { name, value } = e.target
      valuesRef.current = { ...valuesRef.current, [name]: value }
      setState((prev) => ({
        ...prev,
        values: valuesRef.current,
        isDirty: true,
      }))
      if (validateOnChange) {
        validateField(name)
      }
    },

    handleBlur: (e) => {
      const { name } = e.target
      setState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [name]: true,
        },
      }))
      if (validateOnBlur) {
        validateField(name)
      }
    },

    handleSubmit: async (e) => {
      e.preventDefault()
      setState((prev) => ({ ...prev, isSubmitting: true }))

      if (validateForm()) {
        try {
          await onSubmit(valuesRef.current)
        } catch (error) {
          console.error("Form submission error:", error)
        }
      }

      setState((prev) => ({ ...prev, isSubmitting: false }))
    },

    setFieldValue: (field, value) => {
      valuesRef.current = { ...valuesRef.current, [field]: value }
      setState((prev) => ({
        ...prev,
        values: valuesRef.current,
        isDirty: true,
      }))
      if (validateOnChange) {
        validateField(field)
      }
    },

    setFieldTouched: (field, touched = true) => {
      setState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [field]: touched,
        },
      }))
      if (validateOnBlur && touched) {
        validateField(field)
      }
    },

    resetForm: () => {
      valuesRef.current = initialValues
      setState({
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
      })
    },

    validateField,
    validateForm,
  }

  return {
    ...state,
    ...handlers,
  }
}
