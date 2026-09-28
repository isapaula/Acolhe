import React from "react";

interface PsiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showEvolutionBadge?: boolean;
  className?: string;
  variant?: "measured" | "classic" | "monochrome";
}

export const PsiLogo: React.FC<PsiLogoProps> = ({
  size = "md",
  showEvolutionBadge = false,
  className = "",
  variant = "measured",
}) => {
  const sizeMap = {
    sm: { box: "w-8 h-8", text: "text-lg", iconSize: 32 },
    md: { box: "w-11 h-11", text: "text-2xl", iconSize: 44 },
    lg: { box: "w-16 h-16", text: "text-4xl", iconSize: 64 },
    xl: { box: "w-24 h-24", text: "text-6xl", iconSize: 96 },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative inline-flex items-center gap-3 ${className}`}>
      <div
        className={`${currentSize.box} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0f4f8] to-[#EBE5DA] p-1.5 shadow-sm border border-[#A3B8CC]/40 transition-transform duration-300 hover:scale-105`}
        title="Símbolo Psi - Clínica-Escola de Psicologia Acolhe"
      >
        {/* Authentic SVG rendition matching the user's uploaded icons864.png and icons8.png */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Outer glow / soft outline */}
          <path
            d="M12 18 C12 36, 26 44, 32 44 C38 44, 52 36, 52 18"
            stroke="#5a7a8a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Flared top hooks */}
          <path
            d="M9 16 C11 12, 16 13, 14 20"
            stroke="#4A6984"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M55 16 C53 12, 48 13, 50 20"
            stroke="#4A6984"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Central vertical stem with classical pillar capital & base */}
          <path
            d="M32 8 L32 56"
            stroke="#4A6984"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Top pillar capital cap */}
          <path
            d="M24 10 L40 10"
            stroke="#1F3A52"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Bottom pillar foundation base */}
          <path
            d="M22 56 L42 56"
            stroke="#1F3A52"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Clinical calibration dashes along stem (as in icons864.png from user's original site) */}
          {variant === "measured" && (
            <>
              <line x1="29" y1="18" x2="35" y2="18" stroke="#F9F6F0" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="23" x2="35" y2="23" stroke="#F9F6F0" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="28" x2="35" y2="28" stroke="#F9F6F0" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="33" x2="35" y2="33" stroke="#F9F6F0" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="38" x2="35" y2="38" stroke="#F9F6F0" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="43" x2="35" y2="43" stroke="#F9F6F0" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="48" x2="35" y2="48" stroke="#F9F6F0" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* Inner soft cyan highlight filling */}
          <path
            d="M14 20 C14 34, 25 41, 32 41 C39 41, 50 34, 50 20"
            stroke="#A3B8CC"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showEvolutionBadge && (
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#5a7a8a]">
            Evolução do Projeto V1
          </span>
          <span className="text-xs text-[#7A6F62]">
            Clínica-Escola Universitária
          </span>
        </div>
      )}
    </div>
  );
};
