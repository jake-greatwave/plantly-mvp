"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Wrench, Building2, Leaf, Settings } from "lucide-react";

const iconMap = [Wrench, Building2, Leaf, Settings];

interface CategoryCardProps {
  id: string;
  name: string;
  code: string;
  iconUrl?: string | null;
  iconIndex?: number;
  description?: string;
}

export function CategoryCard({
  id,
  name,
  code,
  iconUrl,
  iconIndex,
  description,
}: CategoryCardProps) {
  const router = useRouter();
  const Icon =
    iconIndex !== undefined && iconIndex < iconMap.length
      ? iconMap[iconIndex]
      : Wrench;

  const handleClick = () => {
    router.push(`/companies?parent_category_id=${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-white border-gray-200 p-5 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer text-center !gap-3"
      style={{ minHeight: "180px", height: "180px" }}
    >
      <div
        className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto"
        style={{ marginBottom: "2px" }}
      >
        {iconUrl ? (
          <img src={iconUrl} alt={name} className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>
      <div className="text-gray-900 text-base font-medium mb-1">{name}</div>
      {description && (
        <div className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{description}</div>
      )}
    </Card>
  );
}
