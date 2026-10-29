import { AuthProvider } from "@/context/auth-provider"
import AuthShell from "@/components/auth/AuthShell"
import AuthBackground from "@/components/auth/AuthBackground"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthProvider>
      <AuthBackground />
      <AuthShell>
        <LoginForm />
      </AuthShell>
    </AuthProvider>
  )
}
