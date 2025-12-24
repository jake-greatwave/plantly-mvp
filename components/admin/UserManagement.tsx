"use client";

import { useEffect, useState } from "react";
import { UserTable } from "./UserTable";
import type { User } from "@/lib/types/admin.types";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("사용자 목록을 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserUpdate = async (
    userId: string,
    updates: {
      is_admin?: boolean;
      status?: "active" | "suspended";
      user_grade?: "basic" | "enterprise" | "enterprise_trial";
    },
    optimisticUpdate: (user: User) => User
  ) => {
    const previousUsers = [...users];
    
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? optimisticUpdate(user) : user
      )
    );

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("사용자 정보 업데이트에 실패했습니다.");
      }
    } catch (err) {
      setUsers(previousUsers);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">사용자 관리</h2>
        <p className="text-gray-600 mt-1">사용자 목록을 확인하고 관리할 수 있습니다.</p>
      </div>
      <UserTable users={users} onUserUpdate={handleUserUpdate} />
    </div>
  );
}

