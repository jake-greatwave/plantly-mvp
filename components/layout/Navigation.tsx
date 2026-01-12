"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Settings, Menu } from "lucide-react";

interface NavigationProps {
  isLoggedIn: boolean;
  userName?: string;
  isAdmin?: boolean;
}

export function Navigation({ isLoggedIn, userName, isAdmin }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasVerifiedCompany, setHasVerifiedCompany] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsChecking(false);
      setHasVerifiedCompany(false);
      return;
    }

    const checkVerifiedCompanies = async () => {
      try {
        const response = await fetch("/api/companies/my", {
          cache: "no-store",
        });
        const result = await response.json();

        if (response.ok && result.success) {
          const hasVerified = result.data?.some(
            (company: any) => company.is_verified === true
          );
          setHasVerifiedCompany(hasVerified);
        } else {
          setHasVerifiedCompany(false);
        }
      } catch {
        setHasVerifiedCompany(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkVerifiedCompanies();
  }, [isLoggedIn, pathname]);

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    router.push("/companies/register");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("로그아웃되었습니다.");
        router.push("/login");
        router.refresh();
      }
    } catch {
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  if (isChecking && isLoggedIn) {
    return (
      <nav className="flex items-center gap-2 md:gap-3 flex-wrap md:flex-nowrap">
        <Button
          onClick={handleRegisterClick}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          기업정보 등록
        </Button>
        {isLoggedIn && (
          <Button asChild variant="ghost">
            <Link href="/my-company">우리 기업</Link>
          </Button>
        )}
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {userName && (
              <Button
                asChild
                variant="ghost"
                className="text-sm text-gray-700 hover:text-gray-900 p-0 h-auto"
              >
                <Link href="/account/settings">{userName}님</Link>
              </Button>
            )}
            <Button onClick={handleLogout} variant="ghost">
              로그아웃
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link href="/login">로그인</Link>
          </Button>
        )}
        {isAdmin && (
          <Button asChild variant="outline" className="border-gray-300 ml-auto shrink-0">
            <Link href="/admin">
              <Settings className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">어드민</span>
            </Link>
          </Button>
        )}
      </nav>
    );
  }

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <nav className="hidden md:flex items-center gap-3">
        {isLoggedIn && hasVerifiedCompany && (
          <Button
            asChild
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-white"
          >
            <Link href="/my-company">우리 기업</Link>
          </Button>
        )}

        {isLoggedIn && hasVerifiedCompany ? (
          <Button onClick={handleRegisterClick} variant="ghost">
            기업정보 등록
          </Button>
        ) : (
          <Button
            onClick={handleRegisterClick}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            기업정보 등록
          </Button>
        )}

        {isLoggedIn && !hasVerifiedCompany && (
          <Button asChild variant="ghost">
            <Link href="/my-company">우리 기업</Link>
          </Button>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {userName && (
              <Button
                asChild
                variant="ghost"
                className="text-sm text-gray-700 hover:text-gray-900 p-0 h-auto"
              >
                <Link href="/account/settings">{userName}님</Link>
              </Button>
            )}
            <Button onClick={handleLogout} variant="ghost">
              로그아웃
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link href="/login">로그인</Link>
          </Button>
        )}

        {isAdmin && (
          <Button asChild variant="outline" className="border-gray-300 shrink-0">
            <Link href="/admin">
              <Settings className="w-4 h-4 mr-2" />
              관리자
            </Link>
          </Button>
        )}
      </nav>

      {/* 모바일 햄버거 메뉴 */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="lg" className="p-3">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <SheetTitle className="sr-only">메뉴</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-2 p-6 pt-16">
                {isLoggedIn && hasVerifiedCompany && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full justify-start h-auto py-3"
                  >
                    <Link href="/my-company" onClick={() => setIsMobileMenuOpen(false)}>우리 기업</Link>
                  </Button>
                )}

                {isLoggedIn && hasVerifiedCompany ? (
                  <Button 
                    onClick={() => {
                      handleRegisterClick();
                      setIsMobileMenuOpen(false);
                    }} 
                    variant="ghost" 
                    className="w-full justify-start h-auto py-3"
                  >
                    기업정보 등록
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleRegisterClick();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full justify-start h-auto py-3"
                  >
                    기업정보 등록
                  </Button>
                )}

                {isLoggedIn && !hasVerifiedCompany && (
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="w-full justify-start h-auto py-3"
                  >
                    <Link href="/my-company" onClick={() => setIsMobileMenuOpen(false)}>우리 기업</Link>
                  </Button>
                )}

                {isLoggedIn ? (
                  <>
                    {userName && (
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start h-auto py-3 text-gray-700 hover:text-gray-900"
                      >
                        <Link href="/account/settings" onClick={() => setIsMobileMenuOpen(false)}>{userName}님</Link>
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }} 
                      variant="ghost" 
                      className="w-full justify-start h-auto py-3"
                    >
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <Button 
                    asChild 
                    variant="default" 
                    className="w-full justify-start h-auto py-3"
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>로그인</Link>
                  </Button>
                )}

                {isAdmin && (
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-gray-300 w-full justify-start h-auto py-3"
                  >
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Settings className="w-4 h-4 mr-2" />
                      어드민
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
