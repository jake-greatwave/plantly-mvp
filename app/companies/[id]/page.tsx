import { Suspense } from "react";
import { CompanyDetailContent } from "@/components/company-detail/CompanyDetailContent";
import { CompanyDetailSkeleton } from "@/components/company-detail/CompanyDetailSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<CompanyDetailSkeleton />}>
        <CompanyDetailContent companyId={id} />
      </Suspense>
    </div>
  );
}

