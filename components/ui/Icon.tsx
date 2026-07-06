import type { IconName } from "@/lib/content";

const paths: Record<IconName, React.ReactNode> = {
  leaf: (
    <>
      <path d="M12 4c4 3 6.2 6.2 6.2 10a6.2 6.2 0 1 1-12.4 0C5.8 10.2 8 7 12 4Z" />
      <path d="M12 8.5v8.5" />
    </>
  ),
  drop: (
    <>
      <path d="M12 4c3 4 5 6.6 5 9.2a5 5 0 1 1-10 0C7 10.6 9 8 12 4Z" />
    </>
  ),
  snow: (
    <>
      <path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" />
      <path d="M12 6l2 2-2 0-2 0 2-2ZM12 18l2-2-2 0-2 0 2 2Z" />
    </>
  ),
  nosugar: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M6.5 6.5l11 11" />
    </>
  ),
  spoon: (
    <>
      <path d="M12 3.2c2.1 0 3.6 1.9 3.6 4.1S13.9 11.4 12 11.4 8.4 9.5 8.4 7.3 9.9 3.2 12 3.2Z" />
      <path d="M12 11.4V20.8" />
    </>
  ),
  shelf: (
    <>
      <path d="M12 3.4l8 3.9v8.6l-8 3.9-8-3.9V7.3l8-3.9Z" />
      <path d="M4 7.3l8 3.9 8-3.9M12 11.2V20" />
    </>
  ),
  bowl: (
    <>
      <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" />
      <path d="M9 11.5V8.4M12 11.5V7.2M15 11.5V8.4" />
    </>
  ),
  servings: (
    <>
      <path d="M4 9.5h16a8 8 0 0 1-16 0Z" />
      <path d="M4 13.5h16a8 8 0 0 1-16 0Z" />
      <path d="M12 5.4V4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.6V12l3 1.8" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  shield: (
    <>
      <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9 13h6M9 17h6" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-.9 11.2a2 2 0 0 1-2 1.8H8.9a2 2 0 0 1-2-1.8L6 8Z" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
    </>
  ),
};

export default function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
