"use client"

import { useTranslation } from "@/context/language-utils"
import { useCallback, useState } from "react"
import { z } from "zod"
import { getErrorMessage } from "@/lib/action-utils"

interface I18nFormOptions<T> {
  initialValues: T
  validationSchema: z.ZodObject<any>
  onSubmit: (values: T) => Promise<void> | void
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  setFieldValue: (field: string, value: any) => void
  setFieldTouched: (field: string, touched?: boolean) => void
  resetForm: () => void
  validateField: (field: string) => void
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
        schema.parse({ [field]: state.values[field] })
        setState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: "",
          },
        }))
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors[0]
          setState(prev => ({
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
    [validationSchema, state.values, language]
  )

  const validateForm = useCallback(() => {
    try {
      validationSchema.parse(state.values)
      setState(prev => ({
        ...prev,
        errors: {},
        isValid: true,
      }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          const field = err.path[0] as string
          newErrors[field] = getErrorMessage(err.message, language)
        })
        setState(prev => ({
          ...prev,
          errors: newErrors,
          isValid: false,
        }))
        return false
      }
      return true
    }
  }, [validationSchema, state.values, language])

  const handlers: I18nFormHandlers = {
    handleChange: (e) => {
      const { name, value } = e.target
      setState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: value,
        },
        isDirty: true,
      }))
      if (validateOnChange) {
        validateField(name)
      }
    },

    handleBlur: (e) => {
      const { name } = e.target
      setState(prev => ({
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
      setState(prev => ({ ...prev, isSubmitting: true }))
      
      if (validateForm()) {
        try {
          await onSubmit(state.values)
        } catch (error) {
          console.error("Form submission error:", error)
        }
      }
      
      setState(prev => ({ ...prev, isSubmitting: false }))
    },

    setFieldValue: (field, value) => {
      setState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          [field]: value,
        },
        isDirty: true,
      }))
      if (validateOnChange) {
        validateField(field)
      }
    },

    setFieldTouched: (field, touched = true) => {
      setState(prev => ({
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