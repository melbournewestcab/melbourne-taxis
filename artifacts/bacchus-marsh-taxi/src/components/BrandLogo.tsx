import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Sleek aerodynamic sports car silhouette matching the theme */}
      <svg
        viewBox="0 0 340 76"
        className={
          size === "sm"
            ? "w-28 h-auto"
            : size === "lg"
            ? "w-52 md:w-60 h-auto"
            : "w-36 sm:w-44 md:w-48 h-auto"
        }
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Melbourne Taxis &amp; Cabs"
      >
        <defs>
          {/* Subtle gradient matching theme primary */}
          <linearGradient id="themeCarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Aerodynamic Car Body with exact negative cutouts for windows */}
        <path
          d="M 16 54
             C 32 50, 56 42, 80 36
             C 100 31, 120 16, 152 9
             C 184 3, 238 9, 272 24
             C 295 33, 318 37, 332 42
             C 326 50, 316 53, 308 53
             C 300 53, 292 44, 282 44
             C 272 44, 262 54, 248 56
             C 240 57, 228 54, 216 54
             C 174 54, 138 54, 100 54
             C 88 54, 80 57, 72 56
             C 62 55, 54 44, 44 44
             C 36 44, 26 52, 16 54
             Z
             M 122 28
             C 123 30, 126 30, 134 29
             C 148 26, 162 20, 172 13
             C 154 13, 136 18, 122 27
             Z
             M 178 13
             C 179 17, 180 25, 184 29
             C 218 29, 252 29, 268 28
             C 248 19, 208 13, 178 13
             Z"
          fill="url(#themeCarGrad)"
          fillRule="evenodd"
        />

        {/* Sleek roof curve highlight streak */}
        <path
          d="M 152 8 C 190 4, 232 9, 266 22"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Front nose contour accent */}
        <path
          d="M 38 48 C 65 42, 92 36, 120 33"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* 2-line brand typography matching theme tokens */}
      <div className="flex flex-col items-center text-center leading-none mt-1">
        <span
          className="font-black uppercase text-foreground tracking-tight"
          style={{
            fontSize:
              size === "sm"
                ? "14px"
                : size === "lg"
                ? "25px"
                : "clamp(15px, 3.2vw, 20px)",
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
          }}
        >
          MELBOURNE
        </span>
        <span
          className="font-black uppercase text-primary tracking-[0.14em]"
          style={{
            fontSize:
              size === "sm"
                ? "11px"
                : size === "lg"
                ? "18px"
                : "clamp(12px, 2.5vw, 15px)",
            lineHeight: 1.15,
          }}
        >
          TAXIS &amp; CABS
        </span>
      </div>
    </div>
  );
}

export default BrandLogo;
