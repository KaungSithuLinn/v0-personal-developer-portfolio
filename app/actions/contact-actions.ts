"use server"

import { type Language } from "@/context/language-utils"
import { validateAction, createContactSchema, withTimeout } from "@/lib/action-utils"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  language: Language
}

export async function submitContact(formData: ContactFormData) {
  return withTimeout(async () => {
    const schema = createContactSchema(formData.language)
    
    return validateAction(
      formData,
      schema,
      formData.language,
      async (validData) => {
        try {
          // Here you would typically send an email or save to a database
          // For now, we'll just simulate a successful submission
          await new Promise(resolve => setTimeout(resolve, 1000))

          return {
            success: true,
            data: validData,
          }
        } catch (error) {
          return {
            success: false,
            errors: {
              formErrors: ["Server error occurred while sending message"],
            },
          }
        }
      }
    )
  }, 5000) // 5 second timeout
}
