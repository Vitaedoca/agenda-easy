'use client'
import Image from 'next/image'
import imagemProfessional from '../../image/luzes.jpg'

interface ProfessionalProps {
  id: string
  fullName: string
  specialty: string
  isSelected: boolean
  onClick: () => void
}

export default function Professional({
  id,
  fullName,
  specialty,
  isSelected,
  onClick,
}: ProfessionalProps) {
  return (
    <div
      className={`flex items-center border rounded-lg w-[350px] p-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 shadow-md ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'
      }`}
      onClick={onClick}
    >
      <Image
        src={imagemProfessional} // Substitua pelo caminho real da imagem
        alt="imagem"
        width={70}
        height={70}
        className="rounded-md"
      />
      <div className="ml-4">
        <p className="text-lg font-semibold text-gray-800">{fullName}</p>
        <p className="text-sm text-gray-600">{specialty}</p>
      </div>
    </div>
  )
}
