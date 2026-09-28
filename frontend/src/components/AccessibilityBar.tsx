import React from "react";
import { Eye, Type, Sparkles, Volume2, ShieldCheck } from "lucide-react";

interface AccessibilityBarProps {
  fontSizeLevel: number;
  setFontSizeLevel: (level: number | ((prev: number) => number)) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  fontSizeLevel,
  setFontSizeLevel,
  highContrast,
  setHighContrast,
  reducedMotion,
  setReducedMotion,
}) => {
  const handleFontIncrease = () => {
    setFontSizeLevel((prev) => Math.min(prev + 1, 3));
  };

  const handleFontDecrease = () => {
    setFontSizeLevel((prev) => Math.max(prev - 1, -1));
  };

  const handleFontReset = () => {
    setFontSizeLevel(0);
  };

  return (
    <div
      role="region"
      aria-label="Barra de Acessibilidade e Preferências"
      className="bg-[#1F3A52] text-[#F9F6F0] text-xs py-1.5 px-4 transition-all border-b border-[#4A6984]"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Skip to Content for screen readers & keyboard users */}
        <div className="flex items-center gap-3">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:px-3 focus:py-1 focus:bg-[#4a8b7f] focus:text-white focus:rounded-md font-medium"
          >
            Pular para o conteúdo principal
          </a>
          <span className="flex items-center gap-1.5 text-[#B2C2B2]">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Portal Acessível • Atendimento Universitário em Psicologia</span>
            <span className="sm:hidden">Acessibilidade</span>
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Font Resizing */}
          <div className="flex items-center gap-1 bg-[#4A6984]/50 px-2 py-0.5 rounded-lg border border-[#A3B8CC]/30">
            <Type className="w-3.5 h-3.5 text-[#A3B8CC]" aria-hidden="true" />
            <span className="text-[11px] text-[#EBE5DA] mr-1 hidden md:inline">Texto:</span>
            <button
              onClick={handleFontDecrease}
              disabled={fontSizeLevel <= -1}
              aria-label="Diminuir tamanho do texto"
              className="px-1.5 py-0.5 rounded hover:bg-[#1F3A52] disabled:opacity-40 font-bold transition-colors cursor-pointer"
              title="Diminuir fonte"
            >
              A-
            </button>
            <button
              onClick={handleFontReset}
              aria-label="Redefinir tamanho do texto"
              className="px-1.5 py-0.5 rounded hover:bg-[#1F3A52] text-[10px] text-[#A3B8CC] transition-colors cursor-pointer"
              title="Tamanho padrão"
            >
              Padrão
            </button>
            <button
              onClick={handleFontIncrease}
              disabled={fontSizeLevel >= 3}
              aria-label="Aumentar tamanho do texto"
              className="px-1.5 py-0.5 rounded hover:bg-[#1F3A52] disabled:opacity-40 font-bold transition-colors cursor-pointer"
              title="Aumentar fonte"
            >
              A+
            </button>
          </div>

          {/* High Contrast */}
          <button
            onClick={() => setHighContrast((prev) => !prev)}
            aria-pressed={highContrast}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
              highContrast
                ? "bg-[#9CAF88] text-[#1F3A52] border-[#F9F6F0]"
                : "bg-[#4A6984]/50 text-[#F9F6F0] hover:bg-[#4A6984] border-[#A3B8CC]/30"
            }`}
            title="Alternar modo de alto contraste"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Alto Contraste</span>
            <span className="sm:hidden">Contraste</span>
          </button>

          {/* Reduced Motion */}
          <button
            onClick={() => setReducedMotion((prev) => !prev)}
            aria-pressed={reducedMotion}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
              reducedMotion
                ? "bg-[#8F9E7B] text-[#1F3A52] border-[#F9F6F0]"
                : "bg-[#4A6984]/50 text-[#F9F6F0] hover:bg-[#4A6984] border-[#A3B8CC]/30"
            }`}
            title="Reduzir animações da página"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden md:inline">Modo Calmo (Sem Animações)</span>
            <span className="md:hidden">Modo Calmo</span>
          </button>

          {/* Plantão CVV Help Badge */}
          <a
            href="tel:188"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#967B62] hover:bg-[#7A6F62] text-white font-semibold transition-colors ml-1"
            title="Apoio emocional emergencial imediato - CVV 188"
          >
            <Volume2 className="w-3 h-3" />
            <span>CVV 188</span>
          </a>
        </div>
      </div>
    </div>
  );
};
