"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/types/database.types";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export async function getCompanies(filters?: {
  is_verified?: boolean;
  is_featured?: boolean;
  category_id?: string;
  region_id?: string;
  search?: string;
}) {
  const supabase = await createClient();
  let query = supabase.from("companies").select(`
      *,
      company_categories(category_id, categories(*)),
      company_regions(region_id, regions(*)),
      company_images(*),
      company_tags(*)
    `);

  if (filters?.is_verified !== undefined) {
    query = query.eq("is_verified", filters.is_verified);
  }

  if (filters?.is_featured !== undefined) {
    query = query.eq("is_featured", filters.is_featured);
  }

  if (filters?.search) {
    query = query.or(
      `company_name.ilike.%${filters.search}%,intro_title.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getCompanyById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select(
      `
      *,
      company_categories(category_id, categories(*)),
      company_regions(region_id, regions(*)),
      company_images(*),
      company_tags(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  await supabase
    .from("companies")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", id);

  return data;
}

export async function createCompany(company: CompanyInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .insert(company)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/companies");
  return data;
}

export async function updateCompany(id: string, company: CompanyUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .update(company)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/companies");
  revalidatePath(`/companies/${id}`);
  return data;
}

export async function deleteCompany(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("companies").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/companies");
  revalidatePath("/my-company");
}

export async function getMyCompanies(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
