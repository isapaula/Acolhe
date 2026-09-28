import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { servicesData } from "../data/initialData";
import { ServiceItem } from "../types";
import { 
  HeartHandshake, 
  Users, 
  GraduationCap, 
  FileCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Calendar, 
  MapPin, 
  X 
} from "lucide-react";

interface ServicesSectionProps {
  onSelectServiceForTriage: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForTriage,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeTab, setActiveTab] = useState<"todos" | "comunidade" | "academicos">("todos");

  useEffect(() => {
    if (selectedService) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedService]);

  const getIcon = (name: string) => {
    switch (name) {
      case "HeartHandshake":
        return <HeartHandshake className="w-6 h-6 text-[#4a8b7f]" />;
      case "Users":
        return <Users className="w-6 h-6 text-[#5a7a8a]" />;
      case "GraduationCap":
        return <GraduationCap className="w-6 h-6 text-[#4A6984]" />;
      case "FileCheck":
        return <FileCheck className="w-6 h-6 text-[#7A6F62]" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-[#9CAF88]" />;
      default:
        return <HeartHandshake className="w-6 h-6 text-[#4a8b7f]" />;
    }
  };

  const filteredServices = servicesData.filter((service) => {
    if (activeTab === "comunidade") {
      return (
        service.id === "atendimento-individual" ||
        service.id === "grupos-terapeuticos" ||
        service.id === "plantao-psicologico"
      );
    }
    if (activeTab === "academicos") {
      return service.id === "cursos-capacitacao" || service.id === "supervisao-clinica";
    }
    return true;
  });

  return (
    <section id="servicos" className="py-20 bg-[#F4F0EA]/70 border-b border-[#EBE5DA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A52]">
            O que oferecemos para você e sua comunidade
          </h2>
          <p className="text-base text-[#7A6F62] leading-relaxed">
            Da psicoterapia individual ao suporte coletivo e formação clínica continuada. 
            Cuidado humanizado e ético acessível a todas as fases da vida.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab("todos")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "todos"
                  ? "bg-[#1F3A52] text-white shadow-sm"
                  : "bg-white text-[#1F3A52] hover:bg-[#EBE5DA] border border-[#EBE5DA]"
              }`}
            >
              Todos os Serviços ({servicesData.length})
            </button>
            <button
              onClick={() => setActiveTab("comunidade")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "comunidade"
                  ? "bg-[#4a8b7f] text-white shadow-sm"
                  : "bg-white text-[#1F3A52] hover:bg-[#EBE5DA] border border-[#EBE5DA]"
              }`}
            >
              Atendimento à Comunidade
            </button>
            <button
              onClick={() => setActiveTab("academicos")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "academicos"
                  ? "bg-[#4A6984] text-white shadow-sm"
                  : "bg-white text-[#1F3A52] hover:bg-[#EBE5DA] border border-[#EBE5DA]"
              }`}
            >
              Formação & Supervisão
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-7 border border-[#EBE5DA] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
            >
              <div className="space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EBE5DA] text-[#5a7a8a]">
                    {service.format}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1F3A52] group-hover:text-[#4A6984] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-[#4a8b7f] mt-1">
                    {service.subtitle}
                  </p>
                </div>

                <p className="text-sm text-[#7A6F62] leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                {/* Key Points snippet */}
                <div className="pt-2 border-t border-[#F4F0EA] space-y-1.5">
                  {service.details.slice(0, 2).map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#5a7a8a]">
                      <Check className="w-3.5 h-3.5 text-[#9CAF88] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 mt-4 border-t border-[#F4F0EA] flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-bold text-[#1F3A52] hover:text-[#4a8b7f] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Ver Detalhes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectServiceForTriage(service.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4a8b7f]/15 hover:bg-[#4a8b7f] text-[#4a8b7f] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner for Clarification */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-[#EBE5DA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-[#B2C2B2]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#4a8b7f]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1F3A52]">
                Dúvida sobre qual modalidade é a mais indicada para o seu momento?
              </div>
              <div className="text-xs text-[#7A6F62]">
                Nossa triagem de acolhimento auxilia na escolha entre atendimento individual, grupal ou plantão.
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectServiceForTriage("Triagem de Acolhimento Geral")}
            className="px-5 py-2.5 rounded-full bg-[#1F3A52] text-white text-xs font-semibold hover:bg-[#4A6984] transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Fazer Triagem Inicial
          </button>
        </div>
      </div>

      {/* Modal with Full Service Details - Portaled to document.body so it sits cleanly above the sticky Navbar in all screen sizes */}
      {selectedService && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#F9F6F0] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EBE5DA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EBE5DA] text-[#7A6F62] transition-colors cursor-pointer"
              aria-label="Fechar detalhes do serviço"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#EBE5DA] flex items-center justify-center">
                {getIcon(selectedService.iconName)}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#5a7a8a]">
                  Modalidade {selectedService.format}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F3A52]">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#7A6F62] leading-relaxed">
              {selectedService.description}
            </p>

            <div className="mt-6 space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-[#EBE5DA] space-y-2">
                <div className="text-xs font-bold text-[#1F3A52] uppercase tracking-wide">
                  Público Alvo e Frequência
                </div>
                <div className="text-xs text-[#5a7a8a] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#9CAF88]" />
                  <span>{selectedService.targetAudience}</span>
                </div>
                <div className="text-xs text-[#5a7a8a] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#9CAF88]" />
                  <span>{selectedService.scheduleInfo}</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1F3A52] uppercase tracking-wide mb-2">
                  Diferenciais e Metodologia:
                </div>
                <div className="space-y-2">
                  {selectedService.details.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#5a7a8a]">
                      <Check className="w-4 h-4 text-[#4a8b7f] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#EBE5DA] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7A6F62] hover:bg-[#EBE5DA] transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  const title = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForTriage(title);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Solicitar Vaga Neste Serviço
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
