'use client'
import { useEffect, useState } from 'react'
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
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, CirclePlus, Trash } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type Appointment = {
  appointmentsId: number
  userName: string
  professionalName: string
  serviceName: string
  appointmentDate: string
  horario: string
}

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'serviceName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Serviço
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('serviceName')}</div>,
  },
  {
    accessorKey: 'professionalName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Profissional
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('professionalName')}</div>,
  },
  {
    accessorKey: 'appointmentDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('appointmentDate')}</div>,
  },
  {
    accessorKey: 'horario',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Hora
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('horario')}</div>,
  },
  {
    id: 'actions',
  },
]

export default function AppointmentsPage() {
  const [data, setData] = useState<Appointment[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    appointmentsId: 0,
    userName: '',
    professionalName: '',
    serviceName: '',
    appointmentDate: '',
    horario: '',
  })

  interface ApiAppointment {
    appointmentsId: number
    userName: string
    professionalName: string
    serviceName: string
    appointmentDate: string
    horario: string
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get<ApiAppointment[]>(
          'http://localhost:8080/appointments',
        )
        // Tipagem explícita para response.data
        const fetchedData: ApiAppointment[] = response.data.map((appt) => ({
          appointmentsId: appt.appointmentsId,
          userName: appt.userName,
          professionalName: appt.professionalName,
          serviceName: appt.serviceName,
          appointmentDate: appt.appointmentDate,
          horario: appt.horario,
        }))
        setData(fetchedData)
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
      }
    }
    fetchAppointments()
  }, [])

  const handleAddAppointment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/appointments',
        newAppointment,
      )
      setData((prevData) => [...prevData, response.data])
      setIsAddPopupOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error)
    }
  }

  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDeletePopupOpen(true)
  }

  const handleDeleteAppointment = async () => {
    if (selectedAppointment) {
      try {
        await axios.delete(
          `http://localhost:8080/appointments/${selectedAppointment.appointmentsId}`,
        )
        setData((prevData) =>
          prevData.filter(
            (appt) =>
              appt.appointmentsId !== selectedAppointment.appointmentsId,
          ),
        )
        setIsDeletePopupOpen(false)
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error)
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
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full p-4">
      <div className="flex justify-between py-4">
        <Input
          placeholder="Filtrar serviços..."
          value={
            (table.getColumn('serviceName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('serviceName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          onClick={() => setIsAddPopupOpen(true)}
          className="flex items-center"
        >
          <CirclePlus className="mr-2" />
          Adicionar Agendamento
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                      {cell.column.id === 'actions' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleDeleteClick(row.original)}
                            variant="destructive"
                          >
                            <Trash className="h-4 w-4" />
                            Deletar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  Nenhum agendamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Popup de Adicionar */}
      {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Adicionar Novo Agendamento
            </h3>
            <div className="space-y-4">
              <label className="block">
                Nome do Usuário:
                <Input
                  type="text"
                  value={newAppointment.userName}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                Nome do Profissional:
                <Input
                  type="text"
                  value={newAppointment.professionalName}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      professionalName: e.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                Nome do Serviço:
                <Input
                  type="text"
                  value={newAppointment.serviceName}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      serviceName: e.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                Data:
                <Input
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      appointmentDate: e.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                Hora:
                <Input
                  type="time"
                  value={newAppointment.horario}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      horario: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddPopupOpen(false)}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button onClick={handleAddAppointment}>Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Deletar */}
      {isDeletePopupOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
            <p>
              Você tem certeza que deseja excluir o agendamento de{' '}
              {selectedAppointment.serviceName}?
            </p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeletePopupOpen(false)}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button onClick={handleDeleteAppointment} variant="destructive">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
