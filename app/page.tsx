import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEFAULT_LANGUAGE } from '@/config/language.config'

export default async function RootPage() {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  const preferredLocale = acceptLanguage.split(',')[0]?.split('-')[0] || DEFAULT_LANGUAGE
  
  redirect(`/${preferredLocale}`)
}
