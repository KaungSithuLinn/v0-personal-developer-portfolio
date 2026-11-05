import { describe, it, expect, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { z } from "zod"
import { useI18nForm } from "@/hooks/use-i18n-form"

vi.mock("@/context/language-utils", () => ({
  useTranslation: () => ({ language: "en" }),
}))

vi.mock("@/lib/action-utils", () => ({
  getErrorMessage: (message: string) => message,
}))

const schema = z.object({
  email: z.string().trim().email("Invalid email address"),
  message: z.string().trim().min(10, "Message is required"),
})

describe("useI18nForm", () => {
  it("reports validation state for invalid fields", () => {
    const { result } = renderHook(() =>
      useI18nForm({
        initialValues: { email: "not-an-email", message: "short" },
        validationSchema: schema,
        onSubmit: () => {},
        validateOnChange: false,
        validateOnBlur: false,
      })
    )

    let emailResult: boolean | undefined
    let messageResult: boolean | undefined
    act(() => {
      emailResult = result.current.validateField("email")
      messageResult = result.current.validateField("message")
    })

    expect(emailResult).toBe(false)
    expect(messageResult).toBe(false)
    expect(result.current.errors.email).toBe("Invalid email address")
    expect(result.current.errors.message).toBe("Message is required")
  })

  it("clears errors for valid fields", () => {
    const { result } = renderHook(() =>
      useI18nForm({
        initialValues: { email: "user@example.com", message: "A valid message" },
        validationSchema: schema,
        onSubmit: () => {},
        validateOnChange: false,
        validateOnBlur: false,
      })
    )

    let emailResult: boolean | undefined
    let messageResult: boolean | undefined
    act(() => {
      emailResult = result.current.validateField("email")
      messageResult = result.current.validateField("message")
    })

    expect(emailResult).toBe(true)
    expect(messageResult).toBe(true)
    expect(result.current.errors.email).toBe("")
    expect(result.current.errors.message).toBe("")
  })
})