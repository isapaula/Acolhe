import React, { useEffect, useState } from "react";
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

interface CurrentUser {
  id: number;
  nome: string;
  email: string;
  papel: number;
}

interface Solicitacao {
  id_solicitacao: number;
  especialidade: string;
  horario_desejado: string;
  solicitacoes_status: string;
}

interface PatientPortalProps {
  onLogout: () => void;
  currentUser: CurrentUser;
  onSolicitarAtendimento: () => void;
  refreshKey: number;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  onLogout,
  currentUser,
  onSolicitarAtendimento,
  refreshKey,
}) => {
  const [activeTab, setActiveTab] = useState<"consultas" | "diario" | "orientacoes">("consultas");
  const [mood, setMood] = useState<string | null>("bem");
  const [moodNote, setMoodNote] = useState("");
  const [moodSaved, setMoodSaved] = useState(false);
  const [inVirtualRoom, setInVirtualRoom] = useState(false);
  const [rescheduleRequested, setRescheduleRequested] = useState(false);
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [carregandoSolicitacao, setCarregandoSolicitacao] = useState(true);
  const [erroSolicitacao, setErroSolicitacao] = useState("");

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 3000);
  };


useEffect(() => {
  let ativo = true;

  async function carregarSolicitacao() {
    setCarregandoSolicitacao(true);
    setErroSolicitacao("");

    try {
      const response = await fetch(
        "http://localhost:8080/solicitacao/status",
        { credentials: "include" }
      );

      const respostaTexto = await response.text();

      console.log("Status HTTP:", response.status);
      console.log("Resposta bruta da API:", respostaTexto);

     
let data: {
  solicitacao?: Solicitacao | null;
  erro?: string;
};

try {
  data = JSON.parse(respostaTexto);
} catch {
  throw new Error(
    `A API retornou uma resposta inválida (HTTP ${response.status}). Verifique o endpoint /solicitacao/status.`
  );
}

if (!response.ok) {
  throw new Error(
    data.erro || `Erro HTTP ${response.status} ao consultar solicitação.`
  );
}

if (ativo) {
  setSolicitacao(data.solicitacao ?? null);
}

    } catch (error) {
      if (ativo) {
        setErroSolicitacao(
          error instanceof Error
            ? error.message
            : "Erro ao consultar solicitação."
        );
      }
    } finally {
      if (ativo) {
        setCarregandoSolicitacao(false);
      }
    }
  }

  carregarSolicitacao();

  return () => {
    ativo = false;
  };
}, [currentUser.id, refreshKey]);


return (
  <div className="min-h-screen bg-[#F9F6F0] text-[#1F3A52]">
    <header className="bg-white border-b border-[#EBE5DA] px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <PsiLogo size="sm" variant="measured" />

        <div>
          <h1 className="font-serif text-lg font-bold">
            Área do Paciente
          </h1>
          <p className="text-xs text-[#5a7a8a]">
            {currentUser.nome}
          </p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2 rounded-xl
          text-xs font-semibold text-[#7A6F62]
          hover:bg-[#F4F0EA] transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sair</span>
      </button>
    </header>

    <main className="max-w-4xl mx-auto px-4 py-12">
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBE5DA] shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#9CAF88]/20 flex items-center justify-center mb-6">
          <Sparkles className="w-7 h-7 text-[#4a8b7f]" />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-[#4a8b7f] mb-3">
          Seu espaço de acolhimento
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
          Olá, {currentUser.nome.split(" ")[0]}! Seja bem-vinda ao Acolhe.
        </h2>

        <p className="text-sm text-[#7A6F62] leading-relaxed mb-6">
          Este é o seu espaço de acolhimento. Para dar o primeiro passo,
          você pode enviar uma solicitação de atendimento à nossa
          clínica-escola. Nossa equipe fará a triagem e orientará você
          sobre as próximas etapas.
        </p>

        
        <div className="bg-[#F9F6F0] border border-[#EBE5DA] rounded-2xl p-5 mb-7">
          {carregandoSolicitacao ? (
            <p className="text-sm">Consultando sua solicitação...</p>
          ) : erroSolicitacao ? (
            <p role="alert" className="text-sm text-red-700">
              {erroSolicitacao}
            </p>
          ) : solicitacao ? (
            <>
              <h3 className="font-semibold text-sm mb-2">
                Sua solicitação de atendimento
              </h3>

              <p className="text-xs text-[#7A6F62] mb-1">
                Serviço: {solicitacao.especialidade}
              </p>

              <p className="text-xs text-[#7A6F62] mb-1">
                Horário desejado: {solicitacao.horario_desejado}
              </p>

              <p className="text-xs text-[#7A6F62]">
                Status: {solicitacao.solicitacoes_status}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-sm mb-2">
                Você ainda não tem uma solicitação de atendimento.
              </h3>

              <p className="text-xs text-[#7A6F62] leading-relaxed">
                Quando enviar sua solicitação, você poderá acompanhar
                o andamento por esta área.
              </p>
            </>
          )}
        </div>

        {!carregandoSolicitacao &&
          !erroSolicitacao &&
          (!solicitacao ||
            solicitacao.solicitacoes_status === "RECUSADA") && (
            <button
              onClick={onSolicitarAtendimento}
              className="px-6 py-3 rounded-xl bg-[#4a8b7f]
                hover:bg-[#3d756b] text-white text-sm font-semibold
                shadow-sm transition-colors"
            >
              Solicitar atendimento
            </button>
          )}
      </section>
    </main>
  </div>
);
};
