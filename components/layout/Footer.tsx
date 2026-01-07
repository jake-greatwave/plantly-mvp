import Image from "next/image";
import { Mail, Phone, MapPin, User } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* 메인 정보 영역 */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-1">
          {/* 로고 */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="플랜틀리 로고"
              width={120}
              height={40}
              className="brightness-0 invert"
            />
          </div>

          {/* 회사 정보 - 가로 배치 */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {/* 회사명 */}
            <span className="font-medium text-white">(주)플랜틀리</span>
            <span className="text-gray-500">|</span>

            {/* 대표자 */}
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              <span>대표 사재헌</span>
            </div>
            <span className="text-gray-500">|</span>

            {/* 이메일 */}
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <a
                href="mailto:jaeheon.sa@plantly.co.kr"
                className="hover:text-white transition-colors"
              >
                jaeheon.sa@plantly.co.kr
              </a>
            </div>
            <span className="text-gray-500">|</span>

            {/* 연락처 */}
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <a
                href="tel:010-9174-7590"
                className="hover:text-white transition-colors"
              >
                010-9174-7590
              </a>
            </div>
            <span className="text-gray-500">|</span>

            {/* 위치 */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>경기도 오산시 대호로 135, 에스아이프라자 802호</span>
            </div>
          </div>
        </div>

        {/* 카카오톡 문구 */}
        <div className="border-t border-gray-800 pt-1 pb-1">
          <p className="text-xs text-gray-400 text-center">
            카카오톡 "플랜틀리주식회사" 검색
          </p>
        </div>

        {/* 저작권 - 하단 */}
        <div className="border-t border-gray-800 pt-1">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} (주)플랜틀리. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
