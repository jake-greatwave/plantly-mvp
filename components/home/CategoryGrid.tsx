import { CategoryCard } from './CategoryCard'
import { getCategories } from '@/lib/actions/categories'

export async function CategoryGrid() {
  const categories = await getCategories(null)

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-gray-900 mb-6 text-center text-2xl font-bold">주요 카테고리</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {categories.map((category) => (
            <div key={category.id} className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(16.666%-0.5rem)]">
              <CategoryCard
                id={category.id}
                name={category.category_name}
                code={category.category_code}
                iconUrl={category.icon_url}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

