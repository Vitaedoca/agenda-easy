'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  CircleUser,
  Menu,
  Search,
  Users,
  ClipboardPenLine,
  UserPlus,
  UserRound,
  BadgeHelp,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'

// Import your pages here
import AppointmentsPage from '@/app/pages/appointments/page'
import ProfessionalPage from '@/app/pages/professional/page'
import ServicesPage from '@/app/pages/services/page'
import UsersPage from '@/app/pages/users/page'
type Page = '/appointments' | '/professional' | '/services' | '/users'

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('/appointments')

  const renderContent = (page: Page) => {
    switch (page) {
      case '/appointments':
        return <AppointmentsPage />
      case '/professional':
        return <ProfessionalPage />
      case '/services':
        return <ServicesPage />
      case '/users':
        return <UsersPage />
      default:
        return <AppointmentsPage />
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ClipboardPenLine className="h-6 w-6" />
              <span className="">Agenda Easy</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${currentPage === '/appointments' ? 'bg-muted text-primary' : ''}`}
                onClick={() => setCurrentPage('/appointments')}
              >
                <UserRound className="h-4 w-4" />
                Agendamentos
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${currentPage === '/professional' ? 'bg-muted text-primary' : ''}`}
                onClick={() => setCurrentPage('/professional')}
              >
                <UserPlus className="h-4 w-4" />
                Profissionais
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${currentPage === '/services' ? 'bg-muted text-primary' : ''}`}
                onClick={() => setCurrentPage('/services')}
              >
                <Users className="h-4 w-4" />
                Serviços
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${currentPage === '/users' ? 'bg-muted text-primary' : ''}`}
                onClick={() => setCurrentPage('/users')}
              >
                <BadgeHelp className="h-4 w-4" />
                Usuários
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              {currentPage.slice(1).charAt(0).toUpperCase() +
                currentPage.slice(2)}
            </h1>
          </div>
          <div className="flex flex-1 justify-center shadow-sm">
            {renderContent(currentPage)}
          </div>
        </main>
      </div>
    </div>
  )
}
