// Textura de grão sutil. Overlay decorativo, não interativo.
export default function Grain({
  opacity = 0.07,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
        backgroundSize: "160px 160px",
        mixBlendMode: "overlay",
      }}
    />
  );
}
