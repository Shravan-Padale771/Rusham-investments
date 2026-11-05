
import type { ServiceId } from "@/config/services";

/**
 * Editorial line illustrations drawn with theme CSS variables.
 * tone="dark" uses the charcoal surface.
 * tone="sage" uses the sage surface.
 */
export function ServiceIllustration({
  id,
  tone,
}: {
  id: ServiceId;
  tone: "dark" | "sage";
}) {
  const dark = tone === "dark";
  const surface = dark
    ? "var(--color-dark)"
    : "var(--color-sage-bg)";
  const ink = dark
    ? "var(--color-dark-foreground)"
    : "var(--color-dark)";
  const soft = dark
    ? "var(--color-sage-bg)"
    : "var(--color-dark-foreground)";
  const accent = "var(--color-accent)";

  const common = {
    fill: "none",
    stroke: ink,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 480 360"
      role="img"
      aria-label=""
      aria-hidden="true"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="480" height="360" fill={surface} />

      <circle
        cx="420"
        cy="50"
        r="110"
        fill="none"
        stroke={soft}
        strokeOpacity="0.25"
        strokeWidth="2"
      />

      {/* 01 - MUTUAL FUNDS */}
      {id === "mutual-funds" && (
        <g>
          <g transform="rotate(-90 160 190)">
            <circle
              cx="160"
              cy="190"
              r="72"
              fill="none"
              stroke={soft}
              strokeOpacity="0.3"
              strokeWidth="30"
            />
            <circle
              cx="160"
              cy="190"
              r="72"
              fill="none"
              stroke={accent}
              strokeWidth="30"
              strokeDasharray="150 453"
            />
            <circle
              cx="160"
              cy="190"
              r="72"
              fill="none"
              stroke={ink}
              strokeWidth="30"
              strokeDasharray="95 453"
              strokeDashoffset="-158"
            />
            <circle
              cx="160"
              cy="190"
              r="72"
              fill="none"
              stroke={soft}
              strokeWidth="30"
              strokeDasharray="60 453"
              strokeDashoffset="-262"
            />
          </g>

          <path d="M290 300h150" {...common} />

          <rect
            x="300"
            y="236"
            width="30"
            height="64"
            rx="4"
            fill={soft}
            fillOpacity="0.55"
          />

          <rect
            x="345"
            y="196"
            width="30"
            height="104"
            rx="4"
            fill={soft}
            fillOpacity="0.8"
          />

          <rect
            x="390"
            y="140"
            width="30"
            height="160"
            rx="4"
            fill={ink}
          />

          <circle cx="405" cy="118" r="8" fill={accent} />
        </g>
      )}

      {/* 02 - HEALTH INSURANCE */}
      {id === "health-insurance" && (
        <g>
          {/* Medical shield */}
          <path
            d="M240 55
               L350 95
               V175
               C350 240 303 288 240 318
               C177 288 130 240 130 175
               V95 Z"
            fill={soft}
            fillOpacity="0.12"
            stroke={ink}
            strokeWidth="4"
            strokeLinejoin="round"
          />

          <path
            d="M240 75
               L330 108
               V175
               C330 226 294 266 240 294
               C186 266 150 226 150 175
               V108 Z"
            fill="none"
            stroke={soft}
            strokeWidth="2"
            strokeDasharray="5 8"
          />

          {/* Medical cross */}
          <rect
            x="220"
            y="125"
            width="40"
            height="130"
            rx="8"
            fill={accent}
            stroke={ink}
            strokeWidth="3"
          />

          <rect
            x="175"
            y="170"
            width="130"
            height="40"
            rx="8"
            fill={accent}
            stroke={ink}
            strokeWidth="3"
          />

          {/* Small medical pulse */}
          <path
            d="M48 190h65l24-30 24 60 24-30h35"
            {...common}
            stroke={accent}
            strokeWidth="4"
          />

          <path
            d="M367 190h65"
            {...common}
            stroke={accent}
            strokeWidth="4"
          />

          <circle cx="240" cy="190" r="7" fill={ink} />
        </g>
      )}

      {/* 03 - LIFE INSURANCE */}
      {id === "life-insurance" && (
        <g>
          {/* Protective shield */}
          <path
            d="M240 48
               L355 92
               V178
               C355 245 306 292 240 324
               C174 292 125 245 125 178
               V92 Z"
            fill={soft}
            fillOpacity="0.12"
            stroke={ink}
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Family figures */}
          <circle cx="205" cy="145" r="25" fill={accent} stroke={ink} strokeWidth="3" />
          <circle cx="275" cy="145" r="25" fill={accent} stroke={ink} strokeWidth="3" />

          <path
            d="M160 265
               C160 215 178 188 205 188
               C232 188 245 215 245 265"
            fill={soft}
            fillOpacity="0.5"
            stroke={ink}
            strokeWidth="3"
          />

          <path
            d="M235 265
               C235 215 248 188 275 188
               C302 188 320 215 320 265"
            fill={soft}
            fillOpacity="0.5"
            stroke={ink}
            strokeWidth="3"
          />

          {/* Protection heart */}
          <path
            d="M240 105
               C225 85 195 98 204 119
               C211 135 240 151 240 151
               C240 151 269 135 276 119
               C285 98 255 85 240 105Z"
            fill={accent}
            stroke={ink}
            strokeWidth="2"
          />

          <path
            d="M80 285h75M325 285h75"
            {...common}
            stroke={accent}
            strokeWidth="3"
          />
        </g>
      )}

      {/* 04 - MOTOR INSURANCE */}
      {id === "motor-insurance" && (
        <g>
          {/* Road */}
          <path
            d="M40 305h400"
            {...common}
            stroke={soft}
            strokeWidth="3"
          />

          <path
            d="M65 305h55M180 305h55M295 305h55M410 305h20"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="12 12"
          />

          {/* Car body */}
          <path
            d="M85 235
               L110 180
               Q118 165 140 165
               H300
               Q325 165 340 188
               L375 235
               V270
               H85 Z"
            fill={soft}
            fillOpacity="0.35"
            stroke={ink}
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Car windows */}
          <path
            d="M125 180h72v55H100Z"
            fill={accent}
            fillOpacity="0.5"
            stroke={ink}
            strokeWidth="3"
          />

          <path
            d="M212 180h86l42 55H212Z"
            fill={accent}
            fillOpacity="0.5"
            stroke={ink}
            strokeWidth="3"
          />

          {/* Wheels */}
          <circle cx="150" cy="270" r="27" fill={surface} stroke={ink} strokeWidth="4" />
          <circle cx="150" cy="270" r="10" fill={accent} />

          <circle cx="315" cy="270" r="27" fill={surface} stroke={ink} strokeWidth="4" />
          <circle cx="315" cy="270" r="10" fill={accent} />

          {/* Protective shield */}
          <path
            d="M370 65
               L420 85
               V120
               C420 148 398 170 370 185
               C342 170 320 148 320 120
               V85 Z"
            fill={accent}
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <path
            d="M348 122l15 15 30-34"
            {...common}
            stroke={surface}
            strokeWidth="5"
          />
        </g>
      )}

      {/* 05 - FINANCIAL PLANNING */}
      {id === "financial-planning" && (
        <g>
          <circle cx="240" cy="190" r="112" {...common} />
          <circle cx="240" cy="190" r="76" {...common} />
          <circle cx="240" cy="190" r="40" {...common} />
          <circle cx="240" cy="190" r="14" fill={accent} />

          <path
            d="M240 190 372 58M372 58h-34M372 58v34"
            {...common}
            stroke={accent}
            strokeWidth="4"
          />

          <path d="M70 320V270M70 270l36 14-36 14" {...common} />
          <path d="M410 320V282" {...common} />

          <circle cx="410" cy="272" r="9" fill={soft} />
        </g>
      )}

      {/* 06 - WEALTH MANAGEMENT */}
      {id === "wealth-management" && (
        <g>
          {[0, 1, 2].map((i) => {
            const y = 250 - i * 56;

            return (
              <g key={i}>
                <path
                  d={`M240 ${y - 64} L372 ${y} L240 ${y + 64} L108 ${y} Z`}
                  fill={
                    i === 2
                      ? accent
                      : i === 1
                        ? soft
                        : surface
                  }
                  fillOpacity={i === 1 ? 0.55 : 1}
                  stroke={ink}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />

                <path
                  d={`M108 ${y} v24 L240 ${y + 88} L372 ${y + 24} V${y}`}
                  fill="none"
                  stroke={ink}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </g>
      )}

      {/* 07 - SIP & GOAL-BASED INVESTING */}
      {id === "sip-goal-investing" && (
        <g>
          <path d="M50 306h380" {...common} />

          {[0, 1, 2, 3, 4].map((col) => {
            const x = 100 + col * 70;

            return (
              <g key={col}>
                {Array.from({ length: col + 1 }).map((_, row) => {
                  const top = col === 4 && row === col;

                  return (
                    <ellipse
                      key={row}
                      cx={x}
                      cy={290 - row * 26}
                      rx="26"
                      ry="11"
                      fill={top ? accent : surface}
                      stroke={ink}
                      strokeWidth="3"
                    />
                  );
                })}
              </g>
            );
          })}

          <path
            d="M100 330h280"
            stroke={soft}
            strokeWidth="3"
            strokeDasharray="1 14"
            strokeLinecap="round"
          />

          <path
            d="M310 90l30-26 26 18 36-40M402 42h-18M402 42v18"
            {...common}
            stroke={accent}
            strokeWidth="4"
          />
        </g>
      )}

      {/* 08 - TAX PLANNING */}
      {id === "tax-planning" && (
        <g>
          <path
            d="M150 50h130l60 60v200H150z"
            fill={surface}
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <path d="M280 50v60h60" {...common} />

          <path
            d="M180 150h120M180 188h90M180 226h120M180 264h70"
            {...common}
            strokeOpacity="0.7"
          />

          <circle
            cx="330"
            cy="256"
            r="52"
            fill={accent}
            stroke={ink}
            strokeWidth="3"
          />

          <path
            d="M310 276l40-40"
            stroke="var(--color-dark)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <circle cx="313" cy="239" r="6" fill="var(--color-dark)" />
          <circle cx="347" cy="273" r="6" fill="var(--color-dark)" />
        </g>
      )}
    </svg>
  );
}
