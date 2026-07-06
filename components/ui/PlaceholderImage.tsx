// Slot de galeria ainda sem foto real. Rotulado para producao.
export default function PlaceholderImage({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-purple-200 bg-purple-100/40 p-4 text-center">
      <span className="eyebrow text-purple-500">Foto a produzir</span>
      <span className="font-body text-sm text-ink-soft">{label}</span>
    </div>
  );
}
