import { CategoryCard } from './CategoryCard'
import { getCategories } from '@/lib/actions/categories'

const MAIN_CATEGORY_ICONS = [
  'Wrench',
  'Building2',
  'Leaf',
  'Settings',
]

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
            />
          ))}
        </div>
      </div>
    </section>
  )
}

