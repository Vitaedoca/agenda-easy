'use client'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMemo, useRef, useState } from 'react'
// import { ConfigService } from '../../service/ConfigService'
import { LoginService } from '../../service/LoginService'
import { useRouter } from 'next/navigation'
import { Toast } from 'primereact/toast'
// const configService = new ConfigService()

export default function Dashboard() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const toast = useRef<Toast>(null)

  const loginService = useMemo(() => new LoginService(), [])

  const efetuarLogin = () => {
    loginService
      .login(email, password)
      .then((response) => {
        console.log('Sucesso')
        console.log(response.data.token)

        localStorage.setItem('TOKEN_APLICAÇÃO_FRONTEND', response.data.token)

        router.push('/')
        window.location.reload()
      })
      .catch(() => {
        toast.current?.show({
          severity: 'error',
          summary: 'Erro!',
          detail: 'Login ou Senha estão inválidos!',
        })

        setEmail('')
        setPassword('')
      })
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <Toast ref={toast} />
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={() => efetuarLogin()}
            >
              Login
            </Button>
            {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <a
              className="underline cursor-pointer"
              onClick={() => router.push('/signup')}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
