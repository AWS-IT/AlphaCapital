import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="ac-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e3cb98" />
          <stop offset="60%" stopColor="#c9a86a" />
          <stop offset="100%" stopColor="#a4854c" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#11223d" />
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="15.5"
        fill="none"
        stroke="url(#ac-gold)"
        strokeOpacity="0.4"
      />
      <path
        d="M14 47 L32 16 L50 47 H42.5 L32 30.5 L21.5 47 Z"
        fill="url(#ac-gold)"
      />
      <rect x="29" y="38" width="6" height="3.2" rx="1.6" fill="#0a162a" />
    </svg>
  );
}
