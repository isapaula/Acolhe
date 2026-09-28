import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  reducedMotion: boolean;
  onOpenTriage: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  reducedMotion,
  onOpenTriage,
}) => {
  const scrollToServices = () => {
    const el = document.getElementById("servicos");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Apresentação Principal"
      className="sticky top-16 z-0 w-full min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex flex-col justify-center items-center relative overflow-hidden px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-[#B89C85]/15 via-[#F9F6F0] to-[#A3B8CC]/20 select-none"
    >
      {/* Conteúdo Principal Centralizado com Máxima Legibilidade */}
      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8 my-auto py-8">
        {/* Título Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F3A52] leading-[1.15]">
            Consultas de psicologia gratuitas para{" "}
            <span className="italic font-normal text-[#4A6984] block sm:inline">
              todos os públicos.
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#5a7a8a] max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            Um espaço seguro de acolhimento e escuta qualificada. Nossos estudantes do 8º ao 10º semestre
            estão prontos para cuidar de você, com o respaldo e supervisão contínua de professores mestres e doutores.
          </p>
        </motion.div>

        {/* Botão de Chamada Primária (CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onOpenTriage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Solicitar Consulta Gratuita</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Indicador Elegante de Scroll */}
      <motion.button
        onClick={scrollToServices}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 pb-4 pt-2 flex flex-col items-center gap-1 text-xs text-[#5a7a8a] hover:text-[#1F3A52] transition-colors cursor-pointer group"
        aria-label="Rolar para os serviços e terapias"
      >
        <span className="font-medium tracking-wide">Conheça nossos serviços</span>
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-[#4A6984] group-hover:text-[#1F3A52]" />
        </motion.div>
      </motion.button>
    </section>
  );
};
