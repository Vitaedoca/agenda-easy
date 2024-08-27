'use client'
import Header from '@/components/ui/header'
import { CalendarDemo } from '@/components/ui/calendario'
import Service from '@/components/ui/service'
import Professional from '@/components/ui/professional'
import CompactItem from '@/components/ui/compactItem'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface ServiceData {
  serviceId: string
  serviceName: string
  description: string
  price: number
}

interface ProfessionalData {
  professionalId: string
  fullName: string
  specialty: string
}

export default function Agenda() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([])
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    null,
  )
  const [selectedProfessional, setSelectedProfessional] =
    useState<ProfessionalData | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/services')
        setServices(response.data)
      } catch (error) {
        console.error('Erro ao buscar serviços:', error)
      }
    }

    const fetchProfessionals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/professional')
        setProfessionals(response.data)
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error)
      }
    }

    fetchServices()
    fetchProfessionals()
  }, [])

  const handleServiceSelect = (service: ServiceData) => {
    setSelectedService(service)
  }

  const handleProfessionalSelect = (professional: ProfessionalData) => {
    setSelectedProfessional(professional)
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleSubmit = () => {
    setShowModal(true)
  }

  const handleConfirm = async () => {
    setShowModal(false)
    setLoading(true)
    try {
      // Simulando a chamada de API para agendar
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setConfirmationMessage('Agendamento realizado com sucesso!')
    } catch (error) {
      console.error('Erro ao realizar agendamento:', error)
      setConfirmationMessage('Falha ao realizar agendamento.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  return (
    <div className="flex flex-col justify-center">
      <Header />

      <div className="flex flex-col items-center justify-center max-w-[650px] p-5">
        <h1 className="text-3xl font-bold mb-2">Salão da Jô</h1>
        <p className="text-slate-400 text-lg mb-1">Av. Marciano Pires, 2515</p>
        <p className="text-slate-400 text-lg mb-1">Matinha - Patrocínio</p>
        <p className="text-slate-400 text-lg"> (11)9000-0000</p>
      </div>

      <div className="flex items-center space-x-4 m-5">
        {selectedService && (
          <CompactItem
            name={selectedService.serviceName}
            onClick={() => setSelectedService(null)}
            isSelected={true}
            type="serviço"
          />
        )}

        {selectedProfessional && (
          <CompactItem
            name={selectedProfessional.fullName}
            onClick={() => setSelectedProfessional(null)}
            isSelected={true}
            type="profissional"
          />
        )}
      </div>

      {!selectedService && (
        <div className="m-5">
          <h1>Serviços</h1>
          {services.map((service) => (
            <div className="m-5" key={service.serviceId}>
              <Service
                id={service.serviceId.toString()}
                text={service.serviceName}
                price={`R$ ${service.price.toFixed(2)}`}
                isSelected={selectedService?.serviceId === service.serviceId}
                onClick={() => handleServiceSelect(service)}
              />
            </div>
          ))}
        </div>
      )}

      {!selectedProfessional && (
        <div className="m-5">
          <h1>Profissionais</h1>
          {professionals.map((professional) => (
            <div className="m-5" key={professional.professionalId}>
              <Professional
                id={professional.professionalId.toString()}
                fullName={professional.fullName}
                specialty={professional.specialty}
                isSelected={
                  selectedProfessional?.professionalId ===
                  professional.professionalId
                }
                onClick={() => handleProfessionalSelect(professional)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="m-5">
        <h1>Escolha a data</h1>
      </div>

      <div className="flex items-center justify-center mt-5">
        <CalendarDemo onSelect={handleDateChange} />
      </div>

      <div className="m-5">
        <h1>Horários</h1>
      </div>

      <div className="p-4">
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {[
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
            ].map((time) => (
              <span
                key={time}
                className={`border rounded-lg px-4 py-2 flex-shrink-0 cursor-pointer ${
                  selectedTime === time ? 'bg-black text-gray-50' : ''
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Button className="m-8" onClick={handleSubmit}>
        Agendar
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmar Agendamento</h2>
            <p className="mb-2">
              <strong>Serviço:</strong> {selectedService?.serviceName}
            </p>
            <p className="mb-2">
              <strong>Profissional:</strong> {selectedProfessional?.fullName}
            </p>
            <p className="mb-2">
              <strong>Data:</strong> {selectedDate?.toLocaleDateString()}
            </p>
            <p className="mb-2">
              <strong>Horário:</strong> {selectedTime}
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <Button onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleConfirm}>Confirmar</Button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-black"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {confirmationMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-lg font-bold mb-4">{confirmationMessage}</p>
            <div className="flex items-center justify-center">
              <Button onClick={() => setConfirmationMessage(null)}>Ok</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
