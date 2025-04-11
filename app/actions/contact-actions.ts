"use server"

import { withTimeout } from "@/lib/action-utils"
import { z } from "zod"

// Define a schema for email validation that's more restrictive than the default Zod email validation
// This helps mitigate the Zod DoS vulnerability
const emailSchema = z
  .string()
  .email()
  .refine(
    (email) => {
      // Additional validation to prevent DoS attacks
      // Limit the length of the email
      if (email.length > 100) return false

      // Limit the number of @ symbols
      const atCount = (email.match(/@/g) || []).length
      if (atCount !== 1) return false

      // Limit the complexity of the domain part
      const domainPart = email.split("@")[1]
      if (domainPart.length > 50) return false

      // Limit the number of dots in the domain
      const dotCount = (domainPart.match(/\./g) || []).length
      if (dotCount > 5) return false

      return true
    },
    { message: "Invalid email format" },
  )

// Define the form schema with the enhanced email validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: emailSchema,
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
})

// The base server action without timeout protection
async function _submitContactForm(data: z.infer<typeof formSchema>) {
  // Validate the data using the schema
  const validatedData = formSchema.parse(data)

  // Here you would typically send the form data to your backend or email service
  // For now, we'll simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return success
  return { success: true, message: "Message sent successfully" }
}

// Export the server action with timeout protection
export const submitContactForm = withTimeout(_submitContactForm, 5000)
