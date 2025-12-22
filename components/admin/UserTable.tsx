"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { User } from "@/lib/types/admin.types";

interface UserTableProps {
  users: User[];
  onUserUpdate: (
    userId: string,
    updates: {
      is_admin?: boolean;
      status?: "active" | "suspended";
      user_grade?: "basic" | "enterprise";
    },
    optimisticUpdate: (user: User) => User
  ) => Promise<void>;
}

export function UserTable({ users, onUserUpdate }: UserTableProps) {
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const handleAdminToggle = async (user: User, checked: boolean) => {
    if (updatingIds.has(user.id)) return;

    setUpdatingIds((prev) => new Set(prev).add(user.id));
    try {
      await onUserUpdate(
        user.id,
        { is_admin: checked },
        (u) => ({ ...u, is_admin: checked })
      );
      toast.success(
        checked
          ? "어드민 권한이 부여되었습니다."
          : "어드민 권한이 제거되었습니다."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "권한 변경에 실패했습니다."
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  };

  const handleStatusToggle = async (user: User, checked: boolean) => {
    if (updatingIds.has(user.id)) return;

    setUpdatingIds((prev) => new Set(prev).add(user.id));
    try {
      await onUserUpdate(
        user.id,
        { status: checked ? "active" : "suspended" },
        (u) => ({ ...u, status: checked ? "active" : "suspended" })
      );
      toast.success(
        checked
          ? "계정이 활성화되었습니다."
          : "계정이 비활성화되었습니다."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "계정 상태 변경에 실패했습니다."
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  };

  const handleGradeChange = async (
    user: User,
    newGrade: "basic" | "enterprise"
  ) => {
    if (updatingIds.has(user.id) || user.user_grade === newGrade) return;

    setUpdatingIds((prev) => new Set(prev).add(user.id));
    try {
      await onUserUpdate(
        user.id,
        { user_grade: newGrade },
        (u) => ({ ...u, user_grade: newGrade })
      );
      toast.success(
        newGrade === "enterprise"
          ? "기업 등급으로 업그레이드되었습니다."
          : "기본 등급으로 변경되었습니다."
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "등급 변경에 실패했습니다."
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                전화번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등급
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                어드민
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                계정 상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  사용자가 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={user.user_grade}
                      onValueChange={(value) =>
                        handleGradeChange(
                          user,
                          value as "basic" | "enterprise"
                        )
                      }
                      disabled={updatingIds.has(user.id)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">기본</SelectItem>
                        <SelectItem value="enterprise">기업</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Checkbox
                        checked={user.is_admin}
                        onCheckedChange={(checked) =>
                          handleAdminToggle(user, checked === true)
                        }
                        disabled={updatingIds.has(user.id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={user.status === "active"}
                        onCheckedChange={(checked) =>
                          handleStatusToggle(user, checked === true)
                        }
                        disabled={updatingIds.has(user.id)}
                      />
                      <span
                        className={`text-xs font-medium ${
                          user.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.status === "active" ? "활성" : "정지"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

