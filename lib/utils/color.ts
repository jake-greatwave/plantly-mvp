export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getGradientBackground(color: string): string {
  const color1 = hexToRgba(color, 0.05);
  const color2 = hexToRgba(color, 0.02);
  const color3 = hexToRgba(color, 0.01);
  return `linear-gradient(to bottom, ${color1} 0%, ${color2} 50%, ${color3} 100%), linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)`;
}





