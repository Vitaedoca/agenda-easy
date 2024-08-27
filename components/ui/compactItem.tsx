'use client'

interface CompactItemProps {
  name: string
  onClick: () => void
  isSelected: boolean
  type: 'profissional' | 'serviço' // Adicionando um novo parâmetro para indicar o tipo
}

export default function CompactItem({
  name,
  onClick,
  isSelected,
  type,
}: CompactItemProps) {
  return (
    <div>
      {/* Exibe a mensagem baseada no tipo */}
      <p className="text-sm text-gray-600">
        {type === 'profissional' ? 'Profissional' : 'Serviço'}
      </p>
      <div
        className={`flex items-center space-x-2 border rounded-full px-3 py-1 cursor-pointer ${
          isSelected ? 'bg-black text-white' : 'bg-gray-200'
        }`}
        onClick={onClick}
      >
        <span>{name}</span>
      </div>
    </div>
  )
}
