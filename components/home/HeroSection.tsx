'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/companies?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-gray-900 mb-3 text-3xl font-bold">
            제조 솔루션 기업을 찾는 가장 쉬운 방법
          </h1>
          <p className="text-gray-600 mb-6 text-base">
            자동화, 금형, 비전검사부터 공장건축까지<br />
            검증된 기업들의 솔루션을 한 곳에서 비교하세요
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="어떤 솔루션을 찾으시나요? (예: CNC 자동화, 사출금형)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 h-auto border-gray-300 focus-visible:ring-blue-600 focus-visible:border-blue-600"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

