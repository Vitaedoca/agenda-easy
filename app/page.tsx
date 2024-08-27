'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Pagina from './pagina/page'

const checkAuth = (): boolean => {
  // Verifica se o token de autenticação existe no localStorage
  return localStorage.getItem('TOKEN_APLICAÇÃO_FRONTEND') !== null
}

export default function Dashboard() {
  const router = useRouter()
  const [autenticado, setAutenticado] = useState<boolean | null>(null)

  useEffect(() => {
    // Aguarda o componente montar antes de verificar a autenticação
    const isAuthenticated = checkAuth()
    setAutenticado(isAuthenticated)

    if (!isAuthenticated) {
      // Adiciona um pequeno atraso para evitar problemas de timing
      setTimeout(() => {
        router.push('/signin')
      }, 100) // 100ms de atraso
    }
  }, [router])

  if (autenticado === null) {
    // Mostra um estado de carregamento enquanto verifica a autenticação
    return <div>Carregando...</div>
  }

  if (!autenticado) {
    // Se não estiver autenticado, o redirecionamento já terá ocorrido, então podemos retornar null
    return null
  }

  // Se autenticado, renderiza a página
  return <Pagina />
}
