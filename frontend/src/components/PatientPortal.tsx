import React, { useState } from "react";
import { PsiLogo } from "./PsiLogo";
import { 
  Calendar, 
  Video, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Smile, 
  Meh, 
  Frown, 
  Sun, 
  AlertCircle,
  FileText,
  LogOut,
  Send
} from "lucide-react";

interface PatientPortalProps {
  onLogout: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<"consultas" | "diario" | "orientacoes">("consultas");
  const [mood, setMood] = useState<string | null>("bem");
  const [moodNote, setMoodNote] = useState("");
  const [moodSaved, setMoodSaved] = useState(false);
  const [inVirtualRoom, setInVirtualRoom] = useState(false);
  const [rescheduleRequested, setRescheduleRequested] = useState(false);

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1F3A52] pb-16">
      {/* Top Portal Nav */}
      <header className="bg-white border-b border-[#EBE5DA] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PsiLogo size="sm" variant="measured" />
          <div>
            <div className="font-serif text-lg font-bold text-[#1F3A52]">
              Área do Paciente
            </div>
            <div className="text-[11px] text-[#5a7a8a]">
              Mariana Albuquerque Silva • Prontuário #PAC-101
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#F4F0EA] text-xs font-semibold text-[#7A6F62] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-white via-[#F4F0EA] to-[#EBE5DA] rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4a8b7f] bg-white px-3 py-1 rounded-full border border-[#EBE5DA]">
              Acolhimento Ativo
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3A52]">
              Bem-vinda de volta, Mariana.
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6F62] max-w-xl leading-relaxed">
              Este é o seu espaço protegido de saúde mental. Suas sessões semanais ocorrem às sextas-feiras
              às 14:00 com o estudante-terapeuta Felipe Souza, sob supervisão da Profa. Dra. Tatiana Linhares.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#EBE5DA] text-right shrink-0">
            <div className="text-[11px] text-[#7A6F62]">Terapeuta Responsável:</div>
            <div className="text-xs font-bold text-[#1F3A52]">Felipe Souza Mendes</div>
            <div className="text-[10px] text-[#5a7a8a]">Estágio Clínico • 9º Semestre</div>
            <div className="text-[10px] text-[#9CAF88] font-semibold mt-1">Supervisão: Profa. Tatiana</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[#EBE5DA] pb-1">
          <button
            onClick={() => setActiveTab("consultas")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === "consultas"
                ? "bg-white text-[#4a8b7f] border-t-2 border-[#4a8b7f] shadow-xs"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            Próxima Sessão & Histórico
          </button>
          <button
            onClick={() => setActiveTab("diario")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === "diario"
                ? "bg-white text-[#4a8b7f] border-t-2 border-[#4a8b7f] shadow-xs"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            Diário de Bem-Estar Emocional
          </button>
          <button
            onClick={() => setActiveTab("orientacoes")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === "orientacoes"
                ? "bg-white text-[#4a8b7f] border-t-2 border-[#4a8b7f] shadow-xs"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            Orientações & Exercícios Terapêuticos
          </button>
        </div>

        {/* Tab 1: Consultas & Sala Virtual */}
        {activeTab === "consultas" && (
          <div className="space-y-6">
            {/* Active Session Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4F0EA] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#4a8b7f] animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4a8b7f]">
                    Próximo Atendimento Confirmado
                  </span>
                </div>
                <span className="text-xs text-[#5a7a8a] bg-[#F4F0EA] px-3 py-1 rounded-full">
                  Sessão nº 07 • TCC
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                  <Calendar className="w-5 h-5 text-[#4A6984]" />
                  <div>
                    <div className="text-[11px] text-[#7A6F62]">Data:</div>
                    <div className="text-xs font-bold text-[#1F3A52]">Sexta-feira, 18 de Setembro</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                  <Clock className="w-5 h-5 text-[#4a8b7f]" />
                  <div>
                    <div className="text-[11px] text-[#7A6F62]">Horário:</div>
                    <div className="text-xs font-bold text-[#1F3A52]">14:00 às 14:50 (50 min)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                  <Video className="w-5 h-5 text-[#967B62]" />
                  <div>
                    <div className="text-[11px] text-[#7A6F62]">Modalidade:</div>
                    <div className="text-xs font-bold text-[#1F3A52]">Teleconsulta (Sala Segura)</div>
                  </div>
                </div>
              </div>

              {/* Enter Virtual Room Component */}
              <div className="bg-[#F4F0EA] rounded-2xl p-6 border border-[#EBE5DA] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <h4 className="font-serif font-bold text-base text-[#1F3A52]">
                    Sala de Atendimento Online Criptografada
                  </h4>
                  <p className="text-xs text-[#7A6F62]">
                    Acesse seu atendimento com sigilo protegido. A sala é aberta 5 minutos antes do horário agendado.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setInVirtualRoom(!inVirtualRoom)}
                    className="px-6 py-3 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>{inVirtualRoom ? "Sair da Sala Virtual" : "Entrar na Sala Virtual"}</span>
                  </button>

                  <button
                    onClick={() => setRescheduleRequested(true)}
                    className="px-4 py-3 rounded-xl bg-white hover:bg-[#EBE5DA] text-[#7A6F62] text-xs font-semibold border border-[#EBE5DA] transition-colors cursor-pointer"
                  >
                    Reagendar
                  </button>
                </div>
              </div>

              {/* Simulated In-Room Video Frame */}
              {inVirtualRoom && (
                <div className="rounded-3xl bg-[#1F3A52] p-6 text-white text-center space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-[#A3B8CC] border-b border-[#4A6984] pb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Conexão Segura Ativa • Teleconsulta Acolhe</span>
                    </span>
                    <span>Criptografia Ponta a Ponta</span>
                  </div>

                  <div className="aspect-video max-h-72 mx-auto rounded-2xl bg-[#4A6984]/30 border border-[#4A6984] flex flex-col items-center justify-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#4a8b7f] flex items-center justify-center text-white text-xl font-bold">
                      FS
                    </div>
                    <div className="text-sm font-bold">Felipe Souza Mendes (Terapeuta)</div>
                    <div className="text-xs text-[#A3B8CC]">
                      Aguardando início da sessão às 14:00. Microfone e câmera prontos.
                    </div>
                  </div>

                  <p className="text-[11px] text-[#A3B8CC]">
                    Você está em um ambiente acadêmico protegido. Em conformidade com a Resolução CFP nº 011/2018.
                  </p>
                </div>
              )}

              {rescheduleRequested && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                  <span>
                    Sua solicitação de reagendamento foi enviada à secretaria da clínica-escola. Felipe e sua supervisora responderão em breve.
                  </span>
                  <button
                    onClick={() => setRescheduleRequested(false)}
                    className="font-bold underline ml-2"
                  >
                    Ok
                  </button>
                </div>
              )}
            </div>

            {/* Past Sessions History */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1F3A52]">
                Histórico de Atendimentos Realizados
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#1F3A52]">
                      Sessão 06 • Transição de Carreira & Registro de Pensamentos
                    </div>
                    <div className="text-[11px] text-[#7A6F62]">
                      11 de Setembro de 2026 • 50 minutos • Conduzida por Felipe Souza
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#9CAF88]/20 text-[#4a8b7f]">
                    Homologada pelo Supervisor
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#1F3A52]">
                      Sessão 05 • Manejo da Ansiedade & Respiração Diafragmática
                    </div>
                    <div className="text-[11px] text-[#7A6F62]">
                      04 de Setembro de 2026 • 50 minutos • Conduzida por Felipe Souza
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#9CAF88]/20 text-[#4a8b7f]">
                    Homologada pelo Supervisor
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Diário Emocional */}
        {activeTab === "diario" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1F3A52]">
                Registro Diário de Humor & Sentimentos
              </h3>
              <p className="text-xs text-[#7A6F62] leading-relaxed">
                Este é um espaço só seu. Anotar como você se sentiu durante a semana ajuda você e seu terapeuta a
                identificarem padrões e progressos ao longo do tratamento.
              </p>
            </div>

            <form onSubmit={handleSaveMood} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-2">
                  Como você está se sentindo hoje?
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setMood("otimo")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                      mood === "otimo"
                        ? "bg-[#9CAF88]/25 border-[#4a8b7f] text-[#4a8b7f]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Em Paz / Otimista</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMood("bem")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                      mood === "bem"
                        ? "bg-[#9CAF88]/25 border-[#4a8b7f] text-[#4a8b7f]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Smile className="w-4 h-4 text-emerald-600" />
                    <span>Tranquila</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMood("neutro")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                      mood === "neutro"
                        ? "bg-[#A3B8CC]/30 border-[#4A6984] text-[#4A6984]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Meh className="w-4 h-4 text-slate-500" />
                    <span>Oscilando / Cansada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMood("ansiosa")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                      mood === "ansiosa"
                        ? "bg-[#B89C85]/30 border-[#967B62] text-[#967B62]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Frown className="w-4 h-4 text-amber-700" />
                    <span>Ansiosa / Sobrecarregada</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  Anotações sobre seu dia (opcional para levar à próxima sessão):
                </label>
                <textarea
                  rows={3}
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Houve alguma situação que desencadeou ansiedade? Como você reagiu?"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f] resize-none"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Salvar Registro</span>
                </button>
              </div>

              {moodSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Seu registro foi salvo! Seu terapeuta poderá utilizá-lo como tema na sexta-feira.</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 3: Orientações */}
        {activeTab === "orientacoes" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#1F3A52]">
              Tarefas e Recursos Psicoeducativos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4a8b7f]">
                  <FileText className="w-4 h-4" />
                  <span>Exercício: Técnica de Respiração 4-7-8</span>
                </div>
                <p className="text-xs text-[#7A6F62] leading-relaxed">
                  Praticar duas vezes ao dia: inspire pelo nariz contando até 4, retenha o ar nos pulmões por 7 segundos
                  e expire lentamente pela boca contando até 8.
                </p>
                <div className="text-[11px] text-[#5a7a8a] bg-white p-2 rounded-xl border border-[#EBE5DA]">
                  Indicado pelo estagiário Felipe após a sessão de 11/09.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4A6984]">
                  <FileText className="w-4 h-4" />
                  <span>Planilha de Pensamentos Automáticos (RPD)</span>
                </div>
                <p className="text-xs text-[#7A6F62] leading-relaxed">
                  Quando notar um aumento de tensão antes da reunião, anote: Qual foi a situação? Qual pensamento veio
                  à mente? Que evidências reais contradizem esse pensamento?
                </p>
                <div className="text-[11px] text-[#5a7a8a] bg-white p-2 rounded-xl border border-[#EBE5DA]">
                  Material de apoio validado na supervisão docente.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
