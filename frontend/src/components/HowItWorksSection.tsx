import React, { useState } from "react";
import { universityFlowSteps } from "../data/initialData";
import { 
  UserPlus, 
  GitMerge, 
  BookOpenCheck, 
  CalendarClock, 
  ShieldCheck, 
  Clock, 
  User, 
  CheckCircle2
} from "lucide-react";

interface HowItWorksSectionProps {
  onOpenTriage: () => void;
  onNavigateToPortal: (role: "paciente" | "aluno" | "professor") => void;
  reducedMotion?: boolean;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onOpenTriage,
  onNavigateToPortal,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentStep = universityFlowSteps[activeStepIndex];

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "UserPlus":
        return <UserPlus className="w-5 h-5" />;
      case "GitMerge":
        return <GitMerge className="w-5 h-5" />;
      case "BookOpenCheck":
        return <BookOpenCheck className="w-5 h-5" />;
      case "CalendarClock":
        return <CalendarClock className="w-5 h-5" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <UserPlus className="w-5 h-5" />;
    }
  };

  return (
    <section 
      id="como-funciona" 
      className="py-16 md:py-24 bg-[#F4F0EA]/70 border-t border-[#EBE5DA] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A52]">
            Como funciona a Clínica-Escola Universitária
          </h2>
          <p className="text-base text-[#7A6F62] leading-relaxed">
            Uma ponte estruturada e segura entre as necessidades da comunidade e a formação dos futuros psicólogos.
            Entenda cada etapa do fluxo, do acolhimento inicial à homologação do estágio.
          </p>
        </div>

        {/* Step Flowchart Navigation Track */}
        <div className="mt-12 relative">
          {/* Connecting Line between steps */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-[#EBE5DA] z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative z-10">
            {universityFlowSteps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={step.step}
                  onClick={() => handleStepClick(idx)}
                  className={`p-4 rounded-2xl text-left transition-colors cursor-pointer relative group border overflow-hidden ${
                    isActive
                      ? "bg-white border-[#4a8b7f] shadow-sm ring-2 ring-[#4a8b7f]/25"
                      : "bg-white/80 hover:bg-white border-[#EBE5DA] hover:border-[#A3B8CC]"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Passo ${step.step}: ${step.title}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-[#4a8b7f] text-white shadow-xs"
                          : "bg-[#F4F0EA] text-[#5a7a8a] group-hover:bg-[#EBE5DA]"
                      }`}
                    >
                      {step.step}
                    </span>
                    <span className="text-[10px] text-[#7A6F62] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A3B8CC]" />
                      <span className="hidden sm:inline">{step.timeframe}</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-xs sm:text-sm font-bold text-[#1F3A52] line-clamp-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-[#7A6F62] line-clamp-2 mt-1 leading-relaxed">
                    {step.summary}
                  </p>

                  {/* Active indicator bar without animation */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4a8b7f]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Flow Step Inspector Card */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#EBE5DA] shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Step overview and specific role narrative */}
            <div className="lg:col-span-8 space-y-5 text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#4a8b7f]/15 text-[#4a8b7f] flex items-center justify-center shrink-0">
                  {getStepIcon(currentStep.iconName)}
                </div>
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A52]">
                    {currentStep.title}
                  </h3>
                  <div className="text-xs text-[#5a7a8a] font-medium mt-0.5">
                    Tempo estimado: {currentStep.timeframe}
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#7A6F62] leading-relaxed">
                {currentStep.summary}
              </p>

              {/* Patient Experience Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4a8b7f]" />
                  <span className="text-xs font-bold text-[#1F3A52] uppercase tracking-wide">
                    Como funciona para você:
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#1F3A52] font-medium leading-relaxed">
                  {currentStep.patientView}
                </p>
              </div>

              {/* Quick checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-[#5a7a8a]">
                  <CheckCircle2 className="w-4 h-4 text-[#4a8b7f] shrink-0" />
                  <span>Sigilo assegurado pelas diretrizes do CFP</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#5a7a8a]">
                  <CheckCircle2 className="w-4 h-4 text-[#4a8b7f] shrink-0" />
                  <span>Prontuário com controle de acesso rigoroso</span>
                </div>
              </div>
            </div>

            {/* Right Col: Quick action buttons */}
            <div className="lg:col-span-4 bg-[#F4F0EA]/70 rounded-2xl p-6 border border-[#EBE5DA] space-y-4 text-center">
              <div className="text-xs font-bold text-[#1F3A52] uppercase tracking-wider">
                Acessar o Ambiente
              </div>
              <p className="text-xs text-[#7A6F62]">
                Explore o módulo correspondente a esta etapa na clínica-escola:
              </p>

              <div className="space-y-2">
                <button
                  onClick={onOpenTriage}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Solicitar Consulta Gratuita
                </button>

                <button
                  onClick={() => onNavigateToPortal("paciente")}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#EBE5DA] text-[#1F3A52] text-xs font-semibold border border-[#EBE5DA] transition-colors cursor-pointer"
                >
                  Portal do Paciente
                </button>

                <button
                  onClick={() => onNavigateToPortal("aluno")}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#EBE5DA] text-[#1F3A52] text-xs font-semibold border border-[#EBE5DA] transition-colors cursor-pointer"
                >
                  Prontuário do Aluno
                </button>

                <button
                  onClick={() => onNavigateToPortal("professor")}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#EBE5DA] text-[#1F3A52] text-xs font-semibold border border-[#EBE5DA] transition-colors cursor-pointer"
                >
                  Supervisão do Professor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
