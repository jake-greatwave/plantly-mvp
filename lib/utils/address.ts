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







