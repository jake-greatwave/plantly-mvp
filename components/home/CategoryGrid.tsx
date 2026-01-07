import { CategoryCard } from './CategoryCard'
import { getCategories } from '@/lib/actions/categories'

const MAIN_CATEGORY_ICONS = [
  'Wrench',
  'Building2',
  'Leaf',
  'Settings',
]

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  '제조 솔루션': '금형·지그·자동화·파렛트 등\n생산 핵심 하드웨어',
  '제조 인프라': 'MES·스마트팩토리 등\n공장 관리 IT 시스템',
  '환경·ESG': '청소·집진·안전관리 등\n법적 필수 용역',
  '공장 운영': '공구·자재·유지보수 등\n현장 소모품 일체',
}

export async function CategoryGrid() {
  const allCategories = await getCategories(null)
  
  const mainCategories = allCategories
    .filter(cat => cat.parent_id === null)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 4)

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-gray-900 mb-6 text-center text-2xl font-bold">주요 카테고리</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {mainCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.category_name}
              code={category.category_code}
              iconUrl={category.icon_url}
              iconIndex={index}
              description={CATEGORY_DESCRIPTIONS[category.category_name]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

