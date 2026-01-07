import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-gray-900 mb-3 text-2xl font-bold">우리 회사 솔루션을 소개하고 싶다면?</h2>
        <p className="text-gray-600 mb-6">
          기업회원으로 가입하고 수천 명의 잠재 고객에게 노출하세요
        </p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/signup">
            기업회원 가입하기 →
          </Link>
        </Button>
      </div>
    </section>
  )
}










