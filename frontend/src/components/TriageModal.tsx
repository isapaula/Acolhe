import React, { useState } from "react";
import { X, CheckCircle2, HeartHandshake, Shield, Sparkles } from "lucide-react";
import { PsiLogo } from "./PsiLogo";

interface TriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  onSuccessNavigateToPatient?: () => void;
}

export const TriageModal: React.FC<TriageModalProps> = ({
  isOpen,
  onClose,
  defaultService = "Atendimento Psicológico Individual",
  onSuccessNavigateToPatient,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(defaultService);
  const [modality, setModality] = useState<"Presencial" | "Online">("Presencial");
  const [complaint, setComplaint] = useState("");
  const [urgencyAck, setUrgencyAck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-[#F9F6F0] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#EBE5DA] shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EBE5DA] text-[#7A6F62] transition-colors cursor-pointer"
          aria-label="Fechar formulário de inscrição"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#4a8b7f]/20 text-[#4a8b7f] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#1F3A52]">
              Inscrição de Triagem Recebida!
            </h3>

            <p className="text-sm text-[#7A6F62] max-w-md mx-auto leading-relaxed">
              Olá, <strong>{name || "Visitante"}</strong>! Seus dados foram encaminhados à equipe de acolhimento da
              clínica-escola Acolhe. Em até 48 horas entraremos em contato para confirmar sua entrevista de triagem.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[#EBE5DA] text-left text-xs text-[#5a7a8a] space-y-1">
              <div><strong>Serviço Solicitado:</strong> {service}</div>
              <div><strong>Modalidade:</strong> {modality}</div>
              <div><strong>Status:</strong> Aguardando alocação de aluno-terapeuta (8º/10º semestre)</div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#EBE5DA] text-[#1F3A52] text-xs font-semibold hover:bg-[#A3B8CC]/40 transition-colors cursor-pointer"
              >
                Voltar ao Início
              </button>

              {onSuccessNavigateToPatient && (
                <button
                  onClick={() => {
                    onClose();
                    onSuccessNavigateToPatient();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#4a8b7f] text-white text-xs font-semibold hover:bg-[#3d756b] transition-colors cursor-pointer"
                >
                  Ver Área do Paciente
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <PsiLogo size="sm" variant="measured" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a8b7f]">
                  Clínica-Escola Gratuita
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F3A52]">
                  Ficha de Acolhimento & Triagem
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#7A6F62] leading-relaxed">
              Preencha os campos abaixo com calma. Todas as informações estão protegidas sob sigilo
              profissional do Código de Ética do Psicólogo e pela LGPD.
            </p>

            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-semibold text-[#7A6F62] border-b border-[#EBE5DA] pb-2">
              <span className={step >= 1 ? "text-[#4a8b7f]" : ""}>1. Seus Dados</span>
              <span>→</span>
              <span className={step >= 2 ? "text-[#4a8b7f]" : ""}>2. Demanda & Preferência</span>
            </div>

            {step === 1 ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como você prefere ser chamado(a)?"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(61) 99999-9999"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                    Serviço de Interesse
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                  >
                    <option value="Atendimento Psicológico Individual">Atendimento Psicológico Individual</option>
                    <option value="Grupos Terapêuticos e Psicoeducativos">Grupos Terapêuticos e Psicoeducativos</option>
                    <option value="Plantão Psicológico e Triagem Acolhedora">Plantão Psicológico de Urgência</option>
                    <option value="Orientação Vocacional e Carreira">Orientação Vocacional e Carreira</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (name && phone && email) setStep(2);
                    }}
                    disabled={!name || !phone || !email}
                    className="px-6 py-2.5 rounded-xl bg-[#4a8b7f] disabled:opacity-50 text-white text-xs font-semibold hover:bg-[#3d756b] transition-colors cursor-pointer"
                  >
                    Próximo Passo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                    Preferência de Modalidade
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setModality("Presencial")}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                        modality === "Presencial"
                          ? "bg-white border-[#4a8b7f] text-[#4a8b7f] shadow-xs"
                          : "bg-white/60 border-[#EBE5DA] text-[#7A6F62]"
                      }`}
                    >
                      <div className="font-bold">Presencial</div>
                      <div className="text-[11px] text-[#7A6F62]">Clínica-Escola no Campus</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModality("Online")}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                        modality === "Online"
                          ? "bg-white border-[#4a8b7f] text-[#4a8b7f] shadow-xs"
                          : "bg-white/60 border-[#EBE5DA] text-[#7A6F62]"
                      }`}
                    >
                      <div className="font-bold">Teleconsulta Online</div>
                      <div className="text-[11px] text-[#7A6F62]">Sala Virtual Segura</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                    Qual é o principal motivo pelo qual você busca acolhimento psicológico agora?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="Conte um pouco do que você está sentindo (ex.: ansiedade nos estudos, término recente, luto, desânimo...)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f] resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#F4F0EA] border border-[#EBE5DA] text-[11px] text-[#7A6F62] flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#4a8b7f] shrink-0 mt-0.5" />
                  <span>
                    Compreendo que os atendimentos são realizados por estudantes de Psicologia a partir do 8º semestre,
                    com supervisão pedagógica e clínica de professores da universidade.
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="ack"
                    checked={urgencyAck}
                    onChange={(e) => setUrgencyAck(e.target.checked)}
                    required
                    className="rounded border-[#EBE5DA] text-[#4a8b7f] focus:ring-[#4a8b7f]"
                  />
                  <label htmlFor="ack" className="text-[11px] text-[#1F3A52] font-medium cursor-pointer">
                    Concordo com os termos de triagem e acolhimento da Clínica-Escola Acolhe.
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-xs text-[#7A6F62] hover:bg-[#EBE5DA] transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={!complaint || !urgencyAck || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#4a8b7f] disabled:opacity-50 text-white text-xs font-semibold hover:bg-[#3d756b] transition-colors cursor-pointer"
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar Solicitação de Vaga"}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
