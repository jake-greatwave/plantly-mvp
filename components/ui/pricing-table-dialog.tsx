"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PricingTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRICING_DATA = [
  {
    category: "상위노출 구독제",
    plans: [
      {
        grade: "기본(무료)",
        price: "무료",
        features: "소분류 태그 2개 기본 제공",
        effect: "기본 정보 제공",
      },
      {
        grade: "Basic",
        price: "9만원/월",
        features: "상위 20% 노출, 태그 4개",
        effect: "안정적 리드 확보, 검색 유입 증가",
      },
      {
        grade: "Standard",
        price: "19만원/월",
        features: "상위 15% 노출, 태그 7개, 대표 색상 적용",
        effect: "브랜드 노출 확대",
      },
      {
        grade: "Premium",
        price: "39만원/월",
        features: "상위 10% 노출, 태그 10개, 컬러 배지",
        effect: "기업 전문성 강화",
      },
      {
        grade: "Enterprise",
        price: "79만원/월",
        features: "TOP3 보장, 태그 20개, 추천영역 노출",
        effect: "최상위 브랜딩 포지션 확보",
      },
    ],
  },
  {
    category: "상세페이지 & 영상 & 레퍼런스 등록 등급제",
    plans: [
      {
        grade: "기본(무료)",
        price: "무료",
        features: "이미지 1개 등록 (세로 길이 5,000px 제한)\n레퍼런스 1개 등록",
        effect: "기본 정보 제공",
      },
      {
        grade: "Basic",
        price: "5만원/월",
        features:
          "이미지 1개 등록 (세로 길이 10,000px 제한)\n레퍼런스 2개 등록",
        effect: "검색 신뢰도 향상",
      },
      {
        grade: "Standard",
        price: "10만원/월",
        features:
          "이미지 1개 등록 (세로 길이 15,000px 제한)\n레퍼런스 4개 등록",
        effect: "제품·설비 상세 노출",
      },
      {
        grade: "Premium",
        price: "20만원/월",
        features:
          "이미지 1개 등록 (세로 길이 20,000px 제한)\n레퍼런스 6개 등록\n유튜브 영상 링크 등록 1개",
        effect: "기술·포트폴리오 강화",
      },
      {
        grade: "Enterprise",
        price: "40만원/월",
        features:
          "이미지 1개 등록 (세로 길이 25,000px 제한)\n레퍼런스 등록 제한없음\n유튜브 영상 링크 등록 제한없음",
        effect: "대규모 자료 보유 기업에 최적화",
      },
    ],
  },
  {
    category: "(별도상품)상세페이지 이미지 제작 서비스",
    plans: [
      {
        grade: "상세페이지 이미지 기획 + 제작",
        price: "15만원/세로 5,000px",
        features: "보유 자료(사진, 회사소개서 등) 있을 경우",
        effect: "홈페이지 운영·자료화 부담 해소",
      },
      {
        grade: "별도 문의",
        price: "상담 후 결정",
        features: "방문 상담 + 사진 촬영 등",
        effect: "기술·설비 설명자료 정리",
      },
    ],
    allEffects: [
      "홈페이지 운영·자료화 부담 해소",
      "기술·설비 설명자료 정리",
      "전문 영업자료 확보",
      "기업 브랜딩·입찰자료 활용",
    ],
  },
  {
    category: "배너 광고",
    plans: [
      {
        grade: "메인 최상단",
        price: "200~500만원/월",
        features: "플랫폼 메인 상단 고정 노출",
        effect: "강력한 도달률·인지도 확보",
      },
      {
        grade: "카테고리 상단",
        price: "100~200만원/월",
        features: "카테고리 핵심 지면 노출",
        effect: "타깃 고객 직접 접근",
      },
      {
        grade: "키워드 독점",
        price: "50~100만원/월",
        features: "특정 키워드 검색 시 독점 노출",
        effect: "고의도 고객 즉시 확보",
      },
    ],
  },
];

export function PricingTableDialog({
  open,
  onOpenChange,
}: PricingTableDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[50vw] max-h-[90vh] overflow-y-auto w-[50vw]"
        style={{ maxWidth: "50vw", width: "50vw" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">플랜틀리 가격 정책</DialogTitle>
          <DialogDescription className="text-base pt-2">
            플랜틀리의 유료 서비스 가격표입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {PRICING_DATA.map((item, categoryIndex) => {
            const isImageProductionService =
              item.category === "(별도상품)상세페이지 이미지 제작 서비스";

            return (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.category}
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isImageProductionService ? (
                          <>
                            <TableHead className="w-[200px]">
                              제작 항목
                            </TableHead>
                            <TableHead className="w-[150px]">
                              가격(원/길이)
                            </TableHead>
                            <TableHead>제작 기준</TableHead>
                            <TableHead
                              rowSpan={item.plans.length}
                              className="align-top"
                            >
                              기대 효과
                            </TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead className="w-[120px]">등급</TableHead>
                            <TableHead className="w-[150px]">
                              가격(월/건)
                            </TableHead>
                            <TableHead>제공 기능 및 특징</TableHead>
                            <TableHead>기대 효과</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.plans.map((plan, planIndex) => (
                        <TableRow key={planIndex}>
                          <TableCell className="font-medium">
                            {plan.grade}
                          </TableCell>
                          <TableCell>{plan.price}</TableCell>
                          <TableCell className="whitespace-pre-line wrap-break-word">
                            {plan.features}
                          </TableCell>
                          {isImageProductionService ? (
                            planIndex === 0 && (
                              <TableCell
                                rowSpan={item.plans.length}
                                className="align-top whitespace-pre-line"
                              >
                                {item.allEffects?.map((effect, idx) => (
                                  <div
                                    key={idx}
                                    className={idx > 0 ? "mt-2" : ""}
                                  >
                                    {effect}
                                  </div>
                                )) ||
                                  item.plans.map((p, idx) => (
                                    <div
                                      key={idx}
                                      className={idx > 0 ? "mt-2" : ""}
                                    >
                                      {p.effect}
                                    </div>
                                  ))}
                              </TableCell>
                            )
                          ) : (
                            <TableCell>{plan.effect}</TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
