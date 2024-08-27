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

export type Service = {
  serviceId: number
  serviceName: string
  description: string
  duration: number
  price: number
}

// const formatDateToISO = (date: string): string => {
//   return `${date}T00:00:00Z`
// }

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'serviceName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nome do Serviço
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('serviceName')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'duration',
    header: 'Duração (min)',
    cell: ({ row }) => <div>{row.getValue('duration')}</div>,
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    cell: ({ row }) => <div>{row.getValue('price').toFixed(2)}</div>,
  },
  {
    id: 'actions',
  },
]

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [newService, setNewService] = useState<Service>({
    serviceId: 0,
    serviceName: '',
    description: '',
    duration: 0,
    price: 0,
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/services')
        setData(response.data || [])
      } catch (error) {
        console.error('Erro ao buscar serviços:', error)
      }
    }

    fetchServices()
  }, [])

  const handleAddService = async () => {
    try {
      if (
        !newService.serviceName ||
        !newService.description ||
        !newService.duration ||
        !newService.price
      ) {
        console.error('Nome, descrição, duração e preço são obrigatórios.')
        return
      }

      const response = await axios.post(
        'http://localhost:8080/services',
        newService,
      )
      setData((prevData) => [...prevData, response.data])
      setIsAddPopupOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error)
    }
  }

  const handleEditClick = (service: Service) => {
    setSelectedService(service)
    setNewService(service)
    setIsEditPopupOpen(true)
  }

  const handleEditService = async () => {
    if (selectedService) {
      try {
        await axios.put(
          `http://localhost:8080/services/${selectedService.serviceId}`,
          newService,
        )
        console.log()

        setData((prevData) =>
          prevData.map((s) =>
            s.serviceId === selectedService.serviceId ? newService : s,
          ),
        )
        setIsEditPopupOpen(false)
      } catch (error) {
        console.error('Erro ao editar serviço:', error)
      }
    }
  }

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service)
    setIsDeletePopupOpen(true)
  }

  const handleDeleteService = async () => {
    if (selectedService) {
      try {
        await axios.delete(
          `http://localhost:8080/services/${selectedService.serviceId}`,
        )
        setData((prevData) =>
          prevData.filter((s) => s.serviceId !== selectedService.serviceId),
        )
        setIsDeletePopupOpen(false)
      } catch (error) {
        console.error('Erro ao deletar serviço:', error)
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
          placeholder="Buscar serviço..."
          className="w-1/3"
          onChange={(e) =>
            table.getColumn('serviceName')?.setFilterValue(e.target.value)
          }
        />
        <Button onClick={() => setIsAddPopupOpen(true)}>
          <CirclePlus />
          Adicionar Serviço
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
                  <TableCell className="flex gap-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Popup para Adicionar Serviço */}
      {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Adicionar Serviço</h2>
            <div className="mb-4">
              <label
                htmlFor="serviceName"
                className="block text-sm font-medium"
              >
                Nome do Serviço
              </label>
              <Input
                id="serviceName"
                value={newService.serviceName}
                onChange={(e) =>
                  setNewService({ ...newService, serviceName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Descrição
              </label>
              <Input
                id="description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium">
                Duração (min)
              </label>
              <Input
                id="duration"
                type="number"
                value={newService.duration}
                onChange={(e) =>
                  setNewService({ ...newService, duration: +e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium">
                Preço
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: +e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsAddPopupOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddService}>Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup para Editar Serviço */}
      {isEditPopupOpen && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Editar Serviço</h2>
            <div className="mb-4">
              <label
                htmlFor="editServiceName"
                className="block text-sm font-medium"
              >
                Nome do Serviço
              </label>
              <Input
                id="editServiceName"
                value={newService.serviceName}
                onChange={(e) =>
                  setNewService({ ...newService, serviceName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="editDescription"
                className="block text-sm font-medium"
              >
                Descrição
              </label>
              <Input
                id="editDescription"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="editDuration"
                className="block text-sm font-medium"
              >
                Duração (min)
              </label>
              <Input
                id="editDuration"
                type="number"
                value={newService.duration}
                onChange={(e) =>
                  setNewService({ ...newService, duration: +e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="editPrice" className="block text-sm font-medium">
                Preço
              </label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: +e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsEditPopupOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditService}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup para Excluir Serviço */}
      {isDeletePopupOpen && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Excluir Serviço</h2>
            <p>
              Você tem certeza que deseja excluir o serviço
              {selectedService.serviceName}?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setIsDeletePopupOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleDeleteService} variant="destructive">
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
