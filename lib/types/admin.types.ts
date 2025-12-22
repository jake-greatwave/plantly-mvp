export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  status: "active" | "suspended";
  user_grade: "basic" | "enterprise";
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}


