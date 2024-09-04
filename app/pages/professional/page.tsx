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

export type Profissional = {
  professionalId: number
  fullName: string
  specialty: string
}

export const columns: ColumnDef<Profissional>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('fullName')}</div>
    ),
  },
  {
    accessorKey: 'specialty',
    header: 'Especialidade',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('specialty')}</div>
    ),
  },
  {
    id: 'actions',
    // cell: ({ row }) => {
    //   const profissional = row.original
    //   return (
    //     <div className="flex gap-2">
    //       <Button
    //         onClick={() => handleEditClick(profissional)}
    //         variant="outline"
    //         color="primary"
    //       >
    //         <Edit className="h-4 w-4" />
    //         Editar
    //       </Button>
    //       <Button
    //         onClick={() => handleDeleteClick(profissional)}
    //         color="secondary"
    //         variant="destructive"
    //       >
    //         <Trash className="h-4 w-4" />
    //         Deletar
    //       </Button>
    //     </div>
    //   )
    // },
  },
]

export default function ProfessionalPage() {
  const [data, setData] = useState<Profissional[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [selectedProfissional, setSelectedProfissional] =
    useState<Profissional | null>(null)
  const [newProfissional, setNewProfissional] = useState<Profissional>({
    professionalId: 0,
    fullName: '',
    specialty: '',
  })

  const fetchProfissionais = async () => {
    try {
      const response = await axios.get<Profissional[]>(
        'http://localhost:8080/professional',
      )
      setData(response.data)
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error)
    }
  }

  useEffect(() => {
    fetchProfissionais()
  }, [])

  const handleAddProfissional = async () => {
    try {
      if (!newProfissional.fullName || !newProfissional.specialty) {
        console.error('Nome e especialidade são obrigatórios.')
        return
      }

      const response = await axios.post(
        'http://localhost:8080/professional',
        newProfissional,
      )
      setData((prevData) => [...prevData, response.data])
      setNewProfissional({
        professionalId: 0,
        fullName: '',
        specialty: '',
      })
      setIsAddPopupOpen(false)
      fetchProfissionais()
    } catch (error) {
      console.error('Erro ao cadastrar profissional:', error)
    }
  }

  const handleEditClick = (profissional: Profissional) => {
    setSelectedProfissional(profissional)
    setNewProfissional(profissional)
    setIsEditPopupOpen(true)
  }

  const handleEditProfissional = async () => {
    if (selectedProfissional) {
      try {
        if (!newProfissional.fullName || !newProfissional.specialty) {
          console.error('Nome e especialidade são obrigatórios.')
          return
        }

        await axios.put(
          `http://localhost:8080/professional/${selectedProfissional.professionalId}`,
          newProfissional,
        )
        setData((prevData) =>
          prevData.map((p) =>
            p.professionalId === selectedProfissional.professionalId
              ? newProfissional
              : p,
          ),
        )
        setIsEditPopupOpen(false)
      } catch (error) {
        console.error('Erro ao editar profissional:', error)
      }
    }
  }

  const handleDeleteClick = (profissional: Profissional) => {
    setSelectedProfissional(profissional)
    setIsDeletePopupOpen(true)
  }

  const handleDeleteProfissional = async () => {
    if (selectedProfissional) {
      try {
        await axios.delete(
          `http://localhost:8080/professional/${selectedProfissional.professionalId}`,
        )
        setData((prevData) =>
          prevData.filter(
            (p) => p.professionalId !== selectedProfissional.professionalId,
          ),
        )
        setIsDeletePopupOpen(false)
      } catch (error) {
        console.error('Erro ao deletar profissional:', error)
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
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Buscar profissional..."
          className="w-1/3"
          onChange={(e) =>
            table.getColumn('fullName')?.setFilterValue(e.target.value)
          }
        />
        <Button onClick={() => setIsAddPopupOpen(true)}>
          <CirclePlus />
          Adicionar Profissional
        </Button>
      </div>
      <div className="rounded-md border mt-3">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditClick(row.original)}
                      variant="outline"
                      color="primary"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(row.original)}
                      color="secondary"
                      variant="destructive"
                    >
                      <Trash className="h-4 w-4" />
                      Deletar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Add Profissional Popup */}
      {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Adicionar Profissional</h2>
            <Input
              placeholder="Nome"
              value={newProfissional.fullName}
              onChange={(e) =>
                setNewProfissional({
                  ...newProfissional,
                  fullName: e.target.value,
                })
              }
              className="mb-2"
            />
            <Input
              placeholder="Especialidade"
              value={newProfissional.specialty}
              onChange={(e) =>
                setNewProfissional({
                  ...newProfissional,
                  specialty: e.target.value,
                })
              }
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => handleAddProfissional()}>Adicionar</Button>
              <Button
                onClick={() => setIsAddPopupOpen(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Profissional Popup */}
      {isEditPopupOpen && selectedProfissional && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Editar Profissional</h2>
            <Input
              placeholder="Nome"
              value={newProfissional.fullName}
              onChange={(e) =>
                setNewProfissional({
                  ...newProfissional,
                  fullName: e.target.value,
                })
              }
              className="mb-2"
            />
            <Input
              placeholder="Especialidade"
              value={newProfissional.specialty}
              onChange={(e) =>
                setNewProfissional({
                  ...newProfissional,
                  specialty: e.target.value,
                })
              }
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => handleEditProfissional()}>Salvar</Button>
              <Button
                onClick={() => setIsEditPopupOpen(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Profissional Popup */}
      {isDeletePopupOpen && selectedProfissional && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Confirmar Exclusão</h2>
            <p>
              Tem certeza de que deseja excluir o profissional{' '}
              {selectedProfissional.fullName}?
            </p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setIsDeletePopupOpen(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDeleteProfissional()}
                variant="destructive"
                className="ml-2"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
