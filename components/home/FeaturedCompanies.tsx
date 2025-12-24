import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { CompanyCard } from './CompanyCard'
import { getCompanies } from '@/lib/actions/companies'
import { Button } from '@/components/ui/button'

export async function FeaturedCompanies() {
  const companies = await getCompanies({ is_featured: true })
  const featuredCompanies = companies.slice(0, 6)

  if (featuredCompanies.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 text-2xl font-bold">지금 눈여겨봐야 할 솔루션</h2>
          </div>
          <Button variant="link" asChild className="text-blue-600 hover:text-blue-700 p-0">
            <Link href="/companies">
              전체보기 →
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCompanies.map((company: any) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name={company.company_name}
              logoUrl={company.logo_url}
              description={company.intro_title}
              location={company.address}
              tags={company.company_tags}
              categories={company.company_categories}
            />
          ))}
        </div>
      </div>
    </section>
  )
}



