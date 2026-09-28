import React from "react";
import { PsiLogo } from "./PsiLogo";
import { 
  Heart, 
  BookOpen, 
  Sparkles, 
  Compass, 
  CheckCircle, 
  Quote, 
  ArrowUpRight,
  Award
} from "lucide-react";

export const WhyWeDoItSection: React.FC = () => {
  return (
    <section id="porque-fazemos" className="py-20 md:py-28 bg-[#F9F6F0] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#B89C85]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#A3B8CC]/25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header & Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A52] leading-tight">
              Por que fazemos isso?
            </h2>

            <p className="text-base sm:text-lg text-[#5a7a8a] leading-relaxed">
              No cenário contemporâneo, a saúde mental é frequentemente cercada por promessas imediatistas e
              soluções superficiais. Acreditamos que o sofrimento humano não cabe em receitas prontas — ele exige
              tempo, presença autêntica e fundamentação ético-científica.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#9CAF88]/20 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-[#4a8b7f]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1F3A52]">
                    Democratização Real do Acesso
                  </h4>
                  <p className="text-xs text-[#7A6F62] leading-relaxed">
                    Oferecer atendimento psicológico gratuito e de alta qualidade técnica para a comunidade que não
                    pode arcar com os custos de clínicas privadas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#A3B8CC]/30 flex items-center justify-center shrink-0 mt-1">
                  <BookOpen className="w-4 h-4 text-[#4A6984]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1F3A52]">
                    Formação Humanizada de Novos Psicólogos
                  </h4>
                  <p className="text-xs text-[#7A6F62] leading-relaxed">
                    Alunos do 8º ao 10º semestre vivenciam a prática clínica real, aprendendo a escutar a dor com
                    respeito, rigor metodológico e respaldo presencial dos melhores docentes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#B89C85]/30 flex items-center justify-center shrink-0 mt-1">
                  <Award className="w-4 h-4 text-[#967B62]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1F3A52]">
                    Rigor e Compromisso com o CFP
                  </h4>
                  <p className="text-xs text-[#7A6F62] leading-relaxed">
                    Todo atendimento é sigiloso, segue as diretrizes do Conselho Federal de Psicologia e
                    conta com supervisão acadêmica semanal documentada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Evolution from MeuSiteV1 */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-white via-[#F4F0EA] to-[#EBE5DA] rounded-3xl p-7 border-2 border-white shadow-xl space-y-6 relative">
              <div className="flex items-center justify-between border-b border-[#EBE5DA] pb-4">
                <div className="flex items-center gap-3">
                  <PsiLogo size="sm" variant="measured" />
                  <div>
                    <div className="text-xs font-bold text-[#1F3A52]">
                      Linha do Tempo da Plataforma
                    </div>
                    <div className="text-[11px] text-[#5a7a8a]">
                      Da versão pioneira à clínica integrada
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4a8b7f] text-white">
                  Ativa
                </span>
              </div>

              {/* Evolution Comparison */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/70 border border-[#EBE5DA] space-y-1.5 opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A6F62]">
                      1ª Fase • MeuSiteV1 (Projeto Inicial)
                    </span>
                    <span className="text-[10px] bg-[#EBE5DA] px-2 py-0.5 rounded text-[#7A6F62]">
                      Pioneiro
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6F62] leading-relaxed">
                    Primeiro portal universitário com oferta de consultas para a comunidade, agendamentos manuais e o
                    símbolo Psi clássico com escala de aferição.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-[#4a8b7f]/40 shadow-sm space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F3A52] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#4a8b7f]" />
                      <span>Fase Atual • Acolhe</span>
                    </span>
                    <span className="text-[10px] bg-[#4a8b7f]/20 text-[#4a8b7f] font-bold px-2 py-0.5 rounded">
                      Evoluído
                    </span>
                  </div>
                  <p className="text-xs text-[#1F3A52] font-medium leading-relaxed">
                    Ambiente web moderno e unificado: portal exclusivo para o paciente, prontuário digital com
                    validação docente para o estagiário, teleconsulta protegida e acolhimento humanizado com escuta ética.
                  </p>
                  <div className="text-[11px] text-[#5a7a8a] font-medium flex items-center gap-1 pt-1">
                    <span>Mantendo o coração do projeto: psicologia gratuita para todos</span>
                  </div>
                </div>
              </div>

              {/* Single Line Art Question Mark (nod to Integra PSI page 1) */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#7A6F62]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9CAF88]" />
                  <span>Em conformidade com a Resolução CFP nº 004/2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values (directly keeping the soul of MeuSiteV1) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-[#EBE5DA] shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#A3B8CC]/20 flex items-center justify-center text-[#4A6984]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1F3A52]">Nossa Missão</h3>
            <p className="text-xs text-[#7A6F62] leading-relaxed">
              Democratizar o acesso a atendimentos psicológicos de excelência para a comunidade externa e
              acadêmica, proporcionando aos futuros psicólogos uma vivência clínica ética, crítica e reflexiva.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-[#EBE5DA] shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#9CAF88]/20 flex items-center justify-center text-[#4a8b7f]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1F3A52]">Nossa Visão</h3>
            <p className="text-xs text-[#7A6F62] leading-relaxed">
              Ser referência regional em modelo de clínica-escola integrada, unindo tecnologia humanizada, acolhimento
              inclusivo e rigor pedagógico na formação dos profissionais de saúde mental do futuro.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-[#EBE5DA] shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#B89C85]/20 flex items-center justify-center text-[#967B62]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1F3A52]">Nossos Valores</h3>
            <p className="text-xs text-[#7A6F62] leading-relaxed">
              Ética inegociável, respeito à diversidade e singularidade, acolhimento sem pré-julgamentos, sigilo
              profissional absoluto e compromisso com o desenvolvimento humano em cada sessão.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
