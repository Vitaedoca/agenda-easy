'use client'
import Image from 'next/image'
import imagemProfessional from '../../image/luzes.jpg'

interface ServiceProps {
  id: string
  text: string
  price: string
  isSelected: boolean
  onClick: () => void
}

export default function Service({
  text,
  price,
  isSelected,
  onClick,
}: ServiceProps) {
  return (
    <div
      className={`flex items-center border rounded-lg w-[350px] p-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 shadow-md ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'
      }`}
      onClick={onClick}
    >
      <Image
        src={imagemProfessional} // Substitua pelo caminho real da imagem
        alt="imagem"
        width={70}
        height={70}
        className="rounded-lg object-cover"
      />
      <div className="ml-4">
        <p className="text-lg font-semibold text-gray-800">{text}</p>
        <p className="text-sm text-gray-600">{price}</p>
      </div>
    </div>
  )
}
