import { CompanyCard } from "./CompanyCard";
import { getCompanies } from "@/lib/actions/companies";
import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";

export async function SpotlightCompanies() {
  const supabase = await createClient();

  // 눈 여겨볼 기업만 가져오기 (순서대로 정렬)
  const { data: companies, error } = await supabase
    .from("companies")
    .select(
      `
      *,
      company_categories(category_id, categories(id, category_name, category_code)),
      company_images(id, image_url, image_type, display_order),
      company_tags(id, tag_name)
    `
    )
    .eq("is_spotlight", true)
    .eq("is_verified", true)
    .order("spotlight_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900 text-2xl font-bold">눈 여겨볼 기업</h2>
          </div>
        </div>

        {error || !companies || companies.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>등록된 눈 여겨볼 기업이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {companies.map((company: any) => {
              const mainImage =
                company.company_images?.find(
                  (img: any) => img.image_type === "main"
                )?.image_url || null;

              return (
                <CompanyCard
                  key={company.id}
                  id={company.id}
                  name={company.company_name}
                  mainImage={mainImage}
                  logoUrl={company.logo_url}
                  description={company.intro_title}
                  location={company.address}
                  tags={company.company_tags}
                  categories={company.company_categories}
                  isVerified={company.is_verified}
                  isFeatured={company.is_featured}
                  ceoName={company.ceo_name}
                  industries={company.industries}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
