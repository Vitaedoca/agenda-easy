'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, CirclePlus, Edit, Trash } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type User = {
  userId: number
  fullName: string
  phoneNumber: string
  email: string
  passwordHash: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nome Completo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Telefone',
    cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    id: 'actions',
    // header: 'Ações',
    // cell: ({ row }) => (
    //   <div className="flex gap-2">
    //     {/* <Button
    //       onClick={() => handleEditClick(row.original)}
    //       variant="outline"
    //       color="primary"
    //     >
    //       <Edit className="h-4 w-4" />
    //       Editar
    //     </Button>
    //     <Button
    //       onClick={() => handleDeleteClick(row.original)}
    //       color="secondary"
    //       variant="destructive"
    //     >
    //       <Trash className="h-4 w-4" />
    //       Deletar
    //     </Button> */}
    //   </div>
    // ),
  },
]

export default function UsersPage() {
  const [data, setData] = useState<User[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<User>({
    userId: 0,
    fullName: '',
    phoneNumber: '',
    email: '',
    passwordHash: '',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users')
        setData(response.data || [])
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleAddUser = async () => {
    try {
      if (
        !newUser.fullName ||
        !newUser.phoneNumber ||
        !newUser.email ||
        !newUser.passwordHash
      ) {
        console.error('Nome, telefone, email e senha são obrigatórios.')
        return
      }

      const response = await axios.post('http://localhost:8080/users', newUser)
      setData((prevData) => [...prevData, response.data])
      setIsAddPopupOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
    }
  }

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setNewUser(user)
    setIsEditPopupOpen(true)
  }

  const handleEditUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(
          `http://localhost:8080/users/${selectedUser.userId}`,
          newUser,
        )
        setData((prevData) =>
          prevData.map((u) => (u.userId === selectedUser.userId ? newUser : u)),
        )
        setIsEditPopupOpen(false)
      } catch (error) {
        console.error('Erro ao editar usuário:', error)
      }
    }
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setIsDeletePopupOpen(true)
  }

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`http://localhost:8080/users/${selectedUser.userId}`)
        console.log(selectedUser.userId)
        setData((prevData) =>
          prevData.filter((u) => u.userId !== selectedUser.userId),
        )
        setIsDeletePopupOpen(false)
      } catch (error) {
        console.error('Erro ao deletar usuário:', error)
      }
    }
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <Input
          placeholder="Buscar usuário..."
          className="w-1/3"
          onChange={(e) =>
            table.getColumn('fullName')?.setFilterValue(e.target.value)
          }
        />
        <Button onClick={() => setIsAddPopupOpen(true)}>
          <CirclePlus />
          Adicionar Usuário
        </Button>
      </div>
      <div className="rounded-md border mt-3">
        {data.length === 0 ? (
          <div className="p-4 text-center">Nenhum dado encontrado.</div>
        ) : (
          <Table className="w-full h-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex gap-2 items-center justify-center">
                    <Button
                      onClick={() => handleEditClick(row.original)}
                      variant="outline"
                      color="primary"
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(row.original)}
                      variant="destructive"
                      color="secondary"
                      className="flex items-center gap-1"
                    >
                      <Trash className="h-4 w-4" />
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Popup para Adicionar Usuário */}
      {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Adicionar Usuário</h2>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium">
                Nome Completo
              </label>
              <Input
                id="fullName"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium"
              >
                Telefone
              </label>
              <Input
                id="phoneNumber"
                value={newUser.phoneNumber}
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="passwordHash"
                className="block text-sm font-medium"
              >
                Senha
              </label>
              <Input
                id="passwordHash"
                value={newUser.passwordHash}
                onChange={(e) =>
                  setNewUser({ ...newUser, passwordHash: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddPopupOpen(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button onClick={handleAddUser}>Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup para Editar Usuário */}
      {isEditPopupOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Editar Usuário</h2>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium">
                Nome Completo
              </label>
              <Input
                id="fullName"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium"
              >
                Telefone
              </label>
              <Input
                id="phoneNumber"
                value={newUser.phoneNumber}
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="passwordHash"
                className="block text-sm font-medium"
              >
                Senha
              </label>
              <Input
                id="passwordHash"
                value={newUser.passwordHash}
                onChange={(e) =>
                  setNewUser({ ...newUser, passwordHash: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditPopupOpen(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button onClick={handleEditUser}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup para Deletar Usuário */}
      {isDeletePopupOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Excluir Usuário</h2>
            <p>
              Você tem certeza que deseja excluir o usuário{' '}
              {selectedUser.fullName}?
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => setIsDeletePopupOpen(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button onClick={handleDeleteUser} color="secondary">
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
