import { type Language } from "@/context/language-utils"
import { type ZodError, z } from "zod"
import { SUPPORTED_LANGUAGES } from "@/config/language.config"

/**
 * Wraps a server action with a timeout to prevent DoS attacks
 * @param action The server action function to wrap
 * @param timeoutMs The timeout in milliseconds (default: 5000ms)
 * @returns A wrapped server action that will timeout after the specified duration
 */
export function withTimeout<T, Args extends any[]>(
  action: (...args: Args) => Promise<T>,
  timeoutMs = 5000,
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    // Create a promise that rejects after the specified timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id)
        reject(new Error(`Server action timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })

    // Race the action against the timeout
    return Promise.race([action(...args), timeoutPromise]) as Promise<T>
  }
}

interface ActionErrorMessages {
  formErrors?: string[]
  fieldErrors?: Record<string, string[]>
}

interface ActionResponse<T> {
  success: boolean
  data?: T
  errors?: ActionErrorMessages
}

const errorMessages: Record<Language, Record<string, string>> = {
  en: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    tooShort: "Must be at least {min} characters",
    tooLong: "Must be at most {max} characters",
    invalidFormat: "Please enter a valid format",
    serverError: "Something went wrong. Please try again.",
  },
  zh: {
    required: "此字段为必填项",
    invalidEmail: "请输入有效的电子邮件地址",
    tooShort: "必须至少{min}个字符",
    tooLong: "不能超过{max}个字符",
    invalidFormat: "请输入有效格式",
    serverError: "出现错误，请重试。",
  },
  ms: {
    required: "Bidang ini diperlukan",
    invalidEmail: "Sila masukkan alamat e-mel yang sah",
    tooShort: "Mesti sekurang-kurangnya {min} aksara",
    tooLong: "Mesti tidak melebihi {max} aksara",
    invalidFormat: "Sila masukkan format yang sah",
    serverError: "Sesuatu telah berlaku. Sila cuba lagi.",
  },
  ta: {
    required: "இந்த புலம் தேவை",
    invalidEmail: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
    tooShort: "குறைந்தது {min} எழுத்துகள் இருக்க வேண்டும்",
    tooLong: "அதிகபட்சம் {max} எழுத்துகள் மட்டுமே",
    invalidFormat: "சரியான வடிவமைப்பை உள்ளிடவும்",
    serverError: "ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.",
  },
  ar: {
    required: "هذا الحقل مطلوب",
    invalidEmail: "الرجاء إدخال عنوان بريد إلكتروني صحيح",
    tooShort: "يجب أن يكون {min} حروف على الأقل",
    tooLong: "يجب أن لا يتجاوز {max} حرف",
    invalidFormat: "الرجاء إدخال تنسيق صحيح",
    serverError: "حدث خطأ ما. الرجاء المحاولة مرة أخرى.",
  },
}

export function getErrorMessage(
  key: string,
  language: Language,
  params?: Record<string, string | number>
): string {
  let message = errorMessages[language]?.[key] || errorMessages.en[key] || key

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, String(value))
    })
  }

  return message
}

export function formatZodError(error: ZodError, language: Language): ActionErrorMessages {
  return {
    formErrors: error.errors.map(err => getErrorMessage(err.message, language)),
    fieldErrors: Object.fromEntries(
      Object.entries(error.formErrors?.fieldErrors || {}).map(([field, errors]) => [
        field,
        (errors ?? []).map(err => getErrorMessage(err, language)),
      ])
    ),
  }
}

export function createContactSchema(language: Language) {
  return z.object({
    name: z.string().min(2, {
      message: getErrorMessage("tooShort", language, { min: "2" }),
    }),
    email: z.string().email({
      message: getErrorMessage("invalidEmail", language),
    }),
    subject: z.string().min(5, {
      message: getErrorMessage("tooShort", language, { min: "5" }),
    }),
    message: z.string().min(10, {
      message: getErrorMessage("tooShort", language, { min: "10" }),
    }),
  })
}

export async function validateAction<T>(
  data: unknown,
  schema: z.ZodSchema,
  language: Language,
  action: (validData: T) => Promise<ActionResponse<T>>
): Promise<ActionResponse<T>> {
  try {
    const validData = await schema.parseAsync(data)
    return await action(validData as T)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: formatZodError(error, language),
      }
    }

    return {
      success: false,
      errors: {
        formErrors: [getErrorMessage("serverError", language)],
      },
    }
  }
}
