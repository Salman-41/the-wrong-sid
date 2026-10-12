import { useId } from "react";

/** Original carved-wood study; the bobbin takes its color from the actual pending yarn. */
export function LoomShuttle({ color }: { color: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg viewBox="0 0 44 190" className="shuttle-art" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-wood`}>
          <stop stopColor="#583722" />
          <stop offset=".24" stopColor="#B67D50" />
          <stop offset=".56" stopColor="#D8A16B" />
          <stop offset=".8" stopColor="#92623E" />
          <stop offset="1" stopColor="#4A2E20" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#F1C18A" />
          <stop offset=".5" stopColor="#89502C" />
          <stop offset="1" stopColor="#4D3021" />
        </linearGradient>
      </defs>
      <path
        d="M22 2C6 25 1 54 2 96C3 138 10 167 22 188C35 167 42 138 42 96C43 54 37 25 22 2Z"
        fill={`url(#${id}-wood)`}
        stroke="#38231B"
        strokeWidth="1.2"
      />
      <path
        d="M22 8C10 35 6 58 7 97C8 137 13 162 22 181"
        fill="none"
        stroke="#EDC191"
        strokeOpacity=".57"
        strokeWidth=".7"
      />
      <path
        d="M25 13C33 43 35 63 35 97C34 135 28 159 24 172M17 18C8 49 8 73 9 108M28 24C34 68 31 92 32 120"
        fill="none"
        stroke="#603E29"
        strokeWidth=".55"
        strokeOpacity=".42"
      />
      <rect
        x="10"
        y="50"
        width="24"
        height="90"
        rx="11"
        fill="#382A24"
        stroke={`url(#${id}-rim)`}
        strokeWidth="2.4"
      />
      <rect x="14" y="57" width="16" height="76" rx="5" fill={color} />
      {Array.from({ length: 24 }, (_, i) => (
        <g key={i}>
          <path
            d={`M 13 ${59 + i * 3} Q 22 ${61 + i * 3} 31 ${59 + i * 3}`}
            fill="none"
            stroke={color}
            strokeWidth="2.2"
          />
          <path
            d={`M 14 ${58.6 + i * 3} Q 22 ${60.6 + i * 3} 30 ${58.6 + i * 3}`}
            fill="none"
            stroke="#FFF7DF"
            strokeOpacity=".25"
            strokeWidth=".6"
          />
        </g>
      ))}
      <path
        d="M21 26V41M23 149V162"
        stroke="#4E3324"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="22" cy="44" r="1.3" fill="#3C2B24" />
    </svg>
  );
}
