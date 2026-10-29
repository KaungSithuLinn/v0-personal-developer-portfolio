"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "@/context/language-utils"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

const schema = z.object({
  email: z.string().trim().email("Invalid email address").max(254),
})

export default function LoginForm() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)

  const form = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-foreground">{t("auth.signedInAs", { email: user.email })}</p>
        {user.isAdmin && (
          <p className="text-xs text-muted-foreground">{t("auth.adminNote")}</p>
        )}
        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors"
        >
          {t("auth.signOut")}
        </button>
      </div>
    )
  }

  async function onSubmit(values: { email: string }) {
    setIsSending(true)
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.toLowerCase() }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || "Failed to send magic link")
      }
      toast({ title: t("auth.codeSent") })
      form.reset()
    } catch {
      toast({ title: t("auth.error.server"), variant: "destructive" })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          {t("auth.email")}
        </label>
        <input
          id="email"
          {...form.register("email")}
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          disabled={isSending}
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSending || !form.formState.isValid}
        className="w-full flex justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {isSending ? t("auth.sending") : t("auth.sendCode")}
      </button>
    </form>
  )
}
