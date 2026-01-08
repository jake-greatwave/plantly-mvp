export function formatAddressShort(address: string | null | undefined): string {
  if (!address) return "";

  const parts = address.split(" ");
  
  if (parts.length < 2) return address;

  const sido = parts[0];
  const sigungu = parts[1];

  if (sido && sigungu) {
    return `${sido} ${sigungu}`;
  }

  return address;
}

/**
 * 주소와 상세주소를 합쳐서 표시합니다.
 * 상세주소가 기본 주소에 이미 포함되어 있으면 중복 표시하지 않습니다.
 */
export function formatFullAddress(
  address: string | null | undefined,
  addressDetail: string | null | undefined
): string {
  if (!address) return "";
  
  // address_detail이 없으면 address만 반환
  if (!addressDetail) return address;
  
  // address_detail이 address에 이미 포함되어 있는지 확인
  // 공백을 제거하고 비교하여 중복 체크
  const normalizedAddress = address.trim().replace(/\s+/g, " ");
  const normalizedDetail = addressDetail.trim().replace(/\s+/g, " ");
  
  // address 끝부분에 address_detail이 포함되어 있는지 확인
  if (normalizedAddress.endsWith(normalizedDetail)) {
    return address;
  }
  
  // 포함되어 있지 않으면 합쳐서 반환
  return `${address} ${addressDetail}`;
}











