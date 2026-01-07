export function StatsSection() {
  const stats = [
    { value: '500+', label: '등록 기업' },
    { value: '1,200+', label: '월간 매칭' },
    { value: '95%', label: '만족도' },
  ]

  return (
    <section className="bg-blue-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}










