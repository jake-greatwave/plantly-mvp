import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-1">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="플랜틀리 로고"
              width={120}
              height={40}
              className="brightness-0 invert"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="font-medium text-white">플랜틀리(주)</span>
            <span className="text-gray-500">|</span>

            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <a
                href="mailto:hello@plantly.co.kr"
                className="hover:text-white transition-colors"
              >
                hello@plantly.co.kr
              </a>
            </div>
            <span className="text-gray-500">|</span>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>
                경기도 화성시 동탄구 동탄대로 677-12, 효성ICT타워 1003호 플랜틀리 주식회사
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-1 pb-1">
          <p className="text-xs text-gray-400 text-center">
            카카오톡 "플랜틀리주식회사" 검색
          </p>
        </div>

        <div className="border-t border-gray-800 pt-1">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} 플랜틀리(주). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
