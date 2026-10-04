import React from "react";

interface CabchargeIconProps {
  className?: string;
  variant?: "card" | "compact";
}

/**
 * Authentic Cabcharge eTicket Card Icon
 * Replicates the exact official Cabcharge eTicket design:
 * - Teal / turquoise low-poly geometric triangular tessellation
 * - Black angular diagonal wedge in bottom-right corner with dark faceted pattern
 * - Crisp white "CABCHARGE" logo with right-pointing triangle inside the "A"
 * - White contactless payment wave symbol
 * - Crisp white "eTICKET" typography
 */
export const CabchargeIcon: React.FC<CabchargeIconProps> = ({
  className = "w-16 h-10",
  variant = "card",
}) => {
  if (variant === "compact") {
    return (
      <svg
        viewBox="0 0 44 28"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Cabcharge eTicket"
      >
        <clipPath id="cc-mini-clip">
          <rect width="44" height="28" rx="4" />
        </clipPath>
        <g clipPath="url(#cc-mini-clip)">
          {/* Teal Base */}
          <rect width="44" height="28" fill="#00A3A6" />
          <polygon points="0,0 22,0 11,14" fill="#02B3B6" />
          <polygon points="22,0 44,0 33,14" fill="#009396" />
          <polygon points="11,14 33,14 22,0" fill="#008084" />
          <polygon points="0,0 11,14 0,14" fill="#008C90" />
          <polygon points="33,14 44,14 44,0" fill="#02B8BB" />
          <polygon points="0,14 22,14 11,28" fill="#009EA2" />
          <polygon points="22,14 44,14 33,28" fill="#007B7E" />
          <polygon points="11,28 33,28 22,14" fill="#02B3B6" />
          <polygon points="0,14 11,28 0,28" fill="#00888C" />
          {/* Black bottom-right wedge */}
          <polygon points="18,28 44,14 44,28" fill="#0E1114" />
          <polygon points="30,28 44,20 44,28" fill="#1C2024" />
          {/* Wordmark */}
          <text
            x="4"
            y="9.5"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="5.2"
            fontWeight="900"
            fill="#FFFFFF"
            letterSpacing="0.4"
          >
            CABCHARGE
          </text>
          {/* Contactless waves */}
          <path d="M38 4.5 C39 6, 39 8, 38 9.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <path d="M40 3.5 C41.5 5.5, 41.5 8.5, 40 10.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          {/* eTICKET label */}
          <text
            x="41"
            y="25.5"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="4.2"
            fontWeight="800"
            fill="#FFFFFF"
            textAnchor="end"
            letterSpacing="0.3"
          >
            eTICKET
          </text>
        </g>
        <rect width="44" height="28" rx="4" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="none" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 250 156"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cabcharge eTicket Card"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}
    >
      <defs>
        <clipPath id="cabcharge-card-clip">
          <rect width="250" height="156" rx="14" />
        </clipPath>
      </defs>

      <g clipPath="url(#cabcharge-card-clip)">
        {/* Teal base canvas */}
        <rect width="250" height="156" fill="#009EA2" />

        {/* ── Geometric Teal Isometric Triangle Mesh (Rows of alternating triangles) ── */}
        {/* Row 0: Y 0 to 32 */}
        <polygon points="0,0 36,0 18,32" fill="#02B3B7" />
        <polygon points="36,0 72,0 54,32" fill="#009FA3" />
        <polygon points="72,0 108,0 90,32" fill="#00888C" />
        <polygon points="108,0 144,0 126,32" fill="#01A6AA" />
        <polygon points="144,0 180,0 162,32" fill="#02B8BC" />
        <polygon points="180,0 216,0 198,32" fill="#00969A" />
        <polygon points="216,0 250,0 234,32" fill="#008589" />

        <polygon points="18,32 54,32 36,0" fill="#007B7F" />
        <polygon points="54,32 90,32 72,0" fill="#01A6AA" />
        <polygon points="90,32 126,32 108,0" fill="#02B2B6" />
        <polygon points="126,32 162,32 144,0" fill="#008E92" />
        <polygon points="162,32 198,32 180,0" fill="#007D81" />
        <polygon points="198,32 234,32 216,0" fill="#01A5A9" />

        {/* Row 1: Y 32 to 64 */}
        <polygon points="0,32 36,32 18,64" fill="#008C90" />
        <polygon points="36,32 72,32 54,64" fill="#02B6BA" />
        <polygon points="72,32 108,32 90,64" fill="#009EA2" />
        <polygon points="108,32 144,32 126,64" fill="#007D81" />
        <polygon points="144,32 180,32 162,64" fill="#01A5A9" />
        <polygon points="180,32 216,32 198,64" fill="#02B5B9" />
        <polygon points="216,32 250,32 234,64" fill="#009397" />

        <polygon points="0,0 18,32 0,32" fill="#007D81" />
        <polygon points="18,64 54,64 36,32" fill="#009599" />
        <polygon points="54,64 90,64 72,32" fill="#008286" />
        <polygon points="90,64 126,64 108,32" fill="#02B8BC" />
        <polygon points="126,64 162,64 144,32" fill="#009DA1" />
        <polygon points="162,64 198,64 180,32" fill="#007D81" />
        <polygon points="198,64 234,64 216,32" fill="#01A3A7" />
        <polygon points="234,32 250,32 250,64" fill="#00888C" />

        {/* Row 2: Y 64 to 96 */}
        <polygon points="0,64 36,64 18,96" fill="#02B2B6" />
        <polygon points="36,64 72,64 54,96" fill="#009BA0" />
        <polygon points="72,64 108,64 90,96" fill="#007F83" />
        <polygon points="108,64 144,64 126,96" fill="#01A6AA" />
        <polygon points="144,64 180,64 162,96" fill="#02B5B9" />
        <polygon points="180,64 216,64 198,96" fill="#008D91" />
        <polygon points="216,64 250,64 234,96" fill="#007A7E" />

        <polygon points="0,32 18,64 0,64" fill="#01A5A9" />
        <polygon points="18,96 54,96 36,64" fill="#00787C" />
        <polygon points="54,96 90,96 72,64" fill="#02B8BC" />
        <polygon points="90,96 126,96 108,64" fill="#009BA0" />
        <polygon points="126,96 162,96 144,64" fill="#00868A" />
        <polygon points="162,96 198,96 180,64" fill="#01A8AC" />
        <polygon points="198,96 234,96 216,64" fill="#02B3B7" />

        {/* Row 3: Y 96 to 128 */}
        <polygon points="0,96 36,96 18,128" fill="#009397" />
        <polygon points="36,96 72,96 54,128" fill="#01A6AA" />
        <polygon points="72,96 108,96 90,128" fill="#02B5B9" />
        <polygon points="108,96 144,96 126,128" fill="#008C90" />
        <polygon points="144,96 180,96 162,128" fill="#007B7F" />
        <polygon points="180,96 216,96 198,128" fill="#01A4A8" />
        <polygon points="216,96 250,96 234,128" fill="#02B6BA" />

        <polygon points="0,64 18,96 0,96" fill="#008589" />
        <polygon points="18,128 54,128 36,96" fill="#02B6BA" />
        <polygon points="54,128 90,128 72,96" fill="#008286" />
        <polygon points="90,128 126,128 108,96" fill="#01A5A9" />
        <polygon points="126,128 162,128 144,96" fill="#02B2B6" />
        <polygon points="162,128 198,128 180,96" fill="#008B8F" />
        <polygon points="198,128 234,128 216,96" fill="#00797D" />

        {/* Row 4: Y 128 to 156 */}
        <polygon points="0,128 36,128 18,156" fill="#01A8AC" />
        <polygon points="36,128 72,128 54,156" fill="#008B8F" />
        <polygon points="72,128 108,128 90,156" fill="#007C80" />
        <polygon points="108,128 144,128 126,156" fill="#02B5B9" />
        <polygon points="144,128 180,128 162,156" fill="#009BA0" />
        <polygon points="180,128 216,128 198,156" fill="#00888C" />
        <polygon points="216,128 250,128 234,156" fill="#01A5A9" />

        <polygon points="0,96 18,128 0,128" fill="#02B4B8" />
        <polygon points="18,156 54,156 36,128" fill="#009DA1" />
        <polygon points="54,156 90,156 72,128" fill="#01A4A8" />
        <polygon points="90,156 126,156 108,128" fill="#007D81" />
        <polygon points="0,128 18,156 0,156" fill="#007F83" />

        {/* ── Black Angular Bottom-Right Wedge with Charcoal Low-Poly Facets ── */}
        {/* Main dark wedge polygon cutting from (78, 156) to (250, 78) */}
        <polygon points="76,156 250,76 250,156" fill="#0B0D0F" />

        {/* Internal dark geometric triangles in the black section */}
        <polygon points="76,156 112,156 128,134" fill="#14171A" />
        <polygon points="112,156 148,156 164,120" fill="#1B1E22" />
        <polygon points="148,156 184,156 198,104" fill="#0F1114" />
        <polygon points="184,156 220,156 234,88" fill="#1A1D21" />
        <polygon points="220,156 250,156 250,118" fill="#24282D" />

        <polygon points="76,156 128,134 146,110" fill="#0A0C0E" />
        <polygon points="128,134 164,120 182,94" fill="#1D2125" />
        <polygon points="164,120 198,104 218,84" fill="#121417" />
        <polygon points="198,104 234,88 250,76" fill="#22262B" />

        <polygon points="146,110 182,94 250,76" fill="#0E1013" />
        <polygon points="218,84 250,76 250,102" fill="#181B1F" />
        <polygon points="198,104 250,102 250,136" fill="#0B0D0F" />
        <polygon points="184,156 234,138 250,156" fill="#171A1E" />

        {/* ── Top-Left: Crisp White CABCHARGE Logo ── */}
        <g>
          {/* Main CABCHARGE Text */}
          <text
            x="20"
            y="38"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            fontSize="23"
            fontWeight="900"
            fill="#FFFFFF"
            letterSpacing="0.8"
          >
            CABCHARGE
          </text>
          {/* Black Play Triangle inside the letter "A" */}
          <polygon points="45.5,23.5 53.5,28 45.5,32.5" fill="#0B0D0F" />
        </g>

        {/* ── Top-Right: Contactless Payment Waves ── */}
        <g stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M214 24 C217 28.5, 217 37.5, 214 42" />
          <path d="M220 19 C225.5 25.5, 225.5 40.5, 220 47" />
          <path d="M226 14 C234 22.5, 234 43.5, 226 52" />
        </g>

        {/* ── Bottom-Right: Crisp White eTICKET Typography ── */}
        <text
          x="232"
          y="141"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontSize="17.5"
          fontWeight="800"
          fill="#FFFFFF"
          textAnchor="end"
          letterSpacing="0.8"
        >
          eTICKET
        </text>
      </g>

      {/* Crisp Card Border Outline */}
      <rect
        width="250"
        height="156"
        rx="14"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export default CabchargeIcon;
