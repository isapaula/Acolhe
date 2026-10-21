
import React, { useEffect, useState } from "react";
import { PsiLogo } from "./PsiLogo";
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  LogOut,
  Video,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  Sun,
  FileText,
  Send,
  BookOpen,
  Heart,
  Info,
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

interface SessaoPaciente {
  id_sessao: number;
  id_solicitacao: number;
  data_sessao: string;
  hora_inicio: string;
  hora_fim: string;
  status_sessao: string;
  nome_aluno: string;
}

interface PatientPortalProps {
  onLogout: () => void;
  currentUser: CurrentUser;
  onSolicitarAtendimento: () => void;
  refreshKey: number;
}

type AbaPaciente = "consultas" | "diario" | "orientacoes";

export const PatientPortal: React.FC<PatientPortalProps> = ({
  onLogout,
  currentUser,
  onSolicitarAtendimento,
  refreshKey,
}) => {
  const [activeTab, setActiveTab] =
    useState<AbaPaciente>("consultas");

  const [mood, setMood] = useState<string>("bem");
  const [moodNote, setMoodNote] = useState("");
  const [moodSaved, setMoodSaved] = useState(false);

  const [solicitacao, setSolicitacao] =
    useState<Solicitacao | null>(null);

  const [carregandoSolicitacao, setCarregandoSolicitacao] =
    useState(true);

  const [erroSolicitacao, setErroSolicitacao] = useState("");

  const [sessoes, setSessoes] =
    useState<SessaoPaciente[]>([]);

  const [carregandoSessoes, setCarregandoSessoes] =
    useState(true);

  const [erroSessoes, setErroSessoes] = useState("");

  // Consulta as sessões do paciente autenticado.
  useEffect(() => {
    let ativo = true;

    async function carregarSessoes() {
      setCarregandoSessoes(true);
      setErroSessoes("");

      try {
        const response = await fetch(
          "http://localhost:8080/sessao/sessoesPaciente",
          { credentials: "include" }
        );

        const respostaTexto = await response.text();

        let data: {
          sessoes?: SessaoPaciente[];
          erro?: string;
        };

        try {
          data = JSON.parse(respostaTexto);
        } catch {
          throw new Error(
            `A API retornou uma resposta inválida (HTTP ${response.status}).`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.erro ||
              `Erro HTTP ${response.status} ao consultar sessões.`
          );
        }

        if (!Array.isArray(data.sessoes)) {
          throw new Error(
            "A resposta da API não contém uma lista válida de sessões."
          );
        }

        if (ativo) {
          setSessoes(data.sessoes);
        }
      } catch (error) {
        if (ativo) {
          setErroSessoes(
            error instanceof Error
              ? error.message
              : "Erro ao consultar suas sessões."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoSessoes(false);
        }
      }
    }

    carregarSessoes();

    return () => {
      ativo = false;
    };
  }, [currentUser.id, refreshKey]);

  // Consulta a solicitação de atendimento do paciente.
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
            data.erro ||
              `Erro HTTP ${response.status} ao consultar solicitação.`
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

  const formatarData = (data: string) => {
    // Evita diferenças de fuso horário ao exibir uma data do banco.
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarDataCompleta = (data: string) => {
    const [ano, mes, dia] = data.split("-").map(Number);
    const dataLocal = new Date(ano, mes - 1, dia);

    return dataLocal.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatarHora = (hora: string) => {
    return hora.slice(0, 5);
  };

  const obterInicioSessao = (sessao: SessaoPaciente) => {
    const [ano, mes, dia] = sessao.data_sessao
      .split("-")
      .map(Number);

    const [hora, minuto, segundo = 0] = sessao.hora_inicio
      .split(":")
      .map(Number);

    return new Date(
      ano,
      mes - 1,
      dia,
      hora,
      minuto,
      segundo
    );
  };

  const agora = new Date();

  const sessoesOrdenadas = [...sessoes].sort((a, b) => {
    return (
      obterInicioSessao(a).getTime() -
      obterInicioSessao(b).getTime()
    );
  });

  const sessoesFuturas = sessoesOrdenadas.filter((sessao) => {
    return obterInicioSessao(sessao) >= agora;
  });

  const proximaSessao = sessoesFuturas[0] ?? null;

  const demaisSessoesFuturas = proximaSessao
    ? sessoesFuturas.filter(
        (sessao) => sessao.id_sessao !== proximaSessao.id_sessao
      )
    : [];

  const sessoesPassadas = sessoesOrdenadas.filter((sessao) => {
    return obterInicioSessao(sessao) < agora;
  });

  // O histórico considera somente sessões cujo status confirma
  // que o atendimento foi realizado.
  const statusRealizados = [
    "REALIZADA",
    "REALIZADO",
    "CONCLUIDA",
    "CONCLUÍDA",
    "FINALIZADA",
    "FINALIZADO",
  ];

  const sessoesRealizadas = sessoesPassadas
    .filter((sessao) =>
      statusRealizados.includes(
        sessao.status_sessao.trim().toUpperCase()
      )
    )
    .reverse();

  // Sessões passadas ainda sem confirmação de realização.
  const sessoesAguardandoRegistro = sessoesPassadas
    .filter(
      (sessao) =>
        !statusRealizados.includes(
          sessao.status_sessao.trim().toUpperCase()
        )
    )
    .reverse();

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();

    // Este formulário ainda não grava no banco.
    // O estado é apenas local à tela.
    setMoodSaved(true);
  };

  const renderSessaoCard = (
    sessao: SessaoPaciente,
    destaque = false
  ) => (
    <article
      key={sessao.id_sessao}
      className={`rounded-2xl border p-5 ${
        destaque
          ? "bg-white border-[#D5E0D1] shadow-sm"
          : "bg-[#F9F6F0] border-[#EBE5DA]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="text-sm font-bold text-[#1F3A52]">
          Sessão #{sessao.id_sessao}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-[#A3B8CC]/25 text-[#4A6984]">
          {sessao.status_sessao || "Status não informado"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA]">
          <Calendar className="w-5 h-5 shrink-0 text-[#4A6984]" />

          <div>
            <p className="text-[11px] text-[#7A6F62] mb-1">
              Data
            </p>

            <p className="text-xs font-bold text-[#1F3A52]">
              {formatarDataCompleta(sessao.data_sessao)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA]">
          <Clock className="w-5 h-5 shrink-0 text-[#4a8b7f]" />

          <div>
            <p className="text-[11px] text-[#7A6F62] mb-1">
              Horário
            </p>

            <p className="text-xs font-bold text-[#1F3A52]">
              {formatarHora(sessao.hora_inicio)} às{" "}
              {formatarHora(sessao.hora_fim)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] sm:col-span-2">
          <User className="w-5 h-5 shrink-0 text-[#967B62]" />

          <div>
            <p className="text-[11px] text-[#7A6F62] mb-1">
              Aluno responsável
            </p>

            <p className="text-xs font-bold text-[#1F3A52]">
              {sessao.nome_aluno || "Informação não disponível"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1F3A52] pb-16">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-[#EBE5DA] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PsiLogo size="sm" variant="measured" />

          <div>
            <h3 className="font-serif text-lg font-bold">
              Área do Paciente
            </h3>

            <p className="text-[11px] text-[#5a7a8a]">
              {currentUser.nome}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#F4F0EA] text-xs font-semibold text-[#7A6F62] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Banner de boas-vindas */}
        <section className="bg-gradient-to-r from-white via-[#F4F0EA] to-[#EBE5DA] rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4a8b7f] bg-white px-3 py-1 rounded-full border border-[#EBE5DA]">
              <Heart className="w-3.5 h-3.5" />
              Seu espaço de acolhimento
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Olá, {currentUser.nome.split(" ")[0]}!
            </h2>

            <p className="text-xs sm:text-sm text-[#7A6F62] max-w-xl leading-relaxed">
              Este é o seu espaço de acolhimento. Aqui você pode
              acompanhar suas sessões, consultar orientações gerais
              de bem-estar e acompanhar as informações relacionadas
              à sua solicitação de atendimento.
            </p>
          </div>

          <div className="bg-white/90 rounded-2xl p-4 border border-[#EBE5DA] md:text-right shrink-0 w-full md:w-auto">
            <p className="text-[11px] text-[#7A6F62] mb-1">
              Situação do atendimento
            </p>

            {carregandoSolicitacao ? (
              <p className="text-xs font-semibold">
                Consultando informações...
              </p>
            ) : erroSolicitacao ? (
              <p className="text-xs text-red-700" role="alert">
                Não foi possível consultar o status.
              </p>
            ) : solicitacao ? (
              <>
                <p className="text-xs font-bold text-[#1F3A52]">
                  {solicitacao.solicitacoes_status.replaceAll(
                    "_",
                    " "
                  )}
                </p>

                <p className="text-[10px] text-[#5a7a8a] mt-1">
                  {solicitacao.especialidade}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-[#1F3A52]">
                  Ainda sem solicitação
                </p>

                <p className="text-[10px] text-[#5a7a8a] mt-1">
                  Você pode conhecer os recursos disponíveis.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Navegação por abas */}
        <nav
          aria-label="Navegação do portal do paciente"
          className="flex flex-wrap gap-2 border-b border-[#EBE5DA] pb-2"
        >
          <button
            onClick={() => setActiveTab("consultas")}
            aria-pressed={activeTab === "consultas"}
            className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === "consultas"
                ? "bg-white text-[#4a8b7f] border-t-2 border-[#4a8b7f] shadow-sm"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            Sessões e histórico
          </button>

          <button
            onClick={() => setActiveTab("diario")}
            aria-pressed={activeTab === "diario"}
            className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === "diario"
                ? "bg-white text-[#4a8b7f] border-t-2 border-[#4a8b7f] shadow-sm"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            Diário de bem-estar
          </button>

          <button
            onClick={() => setActiveTab("orientacoes")}
            aria-pressed={activeTab === "orientacoes"}
            className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === "orientacoes"
                ? "bg-white text-[#4a8b7f] border-t-2 border-[#4a8b7f] shadow-sm"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            Orientações terapêuticas
          </button>
        </nav>

        {/* Aba: Sessões e histórico */}
        {activeTab === "consultas" && (
          <section className="space-y-6">
            {carregandoSessoes ? (
              <div className="bg-white rounded-3xl p-8 border border-[#EBE5DA]">
                <p className="text-sm text-[#7A6F62]">
                  Consultando suas sessões...
                </p>
              </div>
            ) : erroSessoes ? (
              <div
                role="alert"
                className="bg-white rounded-3xl p-6 border border-red-200"
              >
                <p className="text-sm text-red-700">
                  {erroSessoes}
                </p>
              </div>
            ) : (
              <>
                {/* Próxima sessão em destaque */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4F0EA] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#4a8b7f]" />

                      <h3 className="text-xs font-bold tracking-wider text-[#4a8b7f]">
                        Próxima sessão agendada
                      </h3>
                    </div>

                    {proximaSessao && (
                      <span className="text-xs text-[#5a7a8a] bg-[#F4F0EA] px-3 py-1 rounded-full">
                        Sessão #{proximaSessao.id_sessao}
                      </span>
                    )}
                  </div>

                  {proximaSessao ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                          <Calendar className="w-5 h-5 shrink-0 text-[#4A6984]" />

                          <div>
                            <p className="text-[11px] text-[#7A6F62]">
                              Data
                            </p>

                            <p className="text-xs font-bold text-[#1F3A52]">
                              {formatarDataCompleta(
                                proximaSessao.data_sessao
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                          <Clock className="w-5 h-5 shrink-0 text-[#4a8b7f]" />

                          <div>
                            <p className="text-[11px] text-[#7A6F62]">
                              Horário
                            </p>

                            <p className="text-xs font-bold text-[#1F3A52]">
                              {formatarHora(
                                proximaSessao.hora_inicio
                              )}{" "}
                              às{" "}
                              {formatarHora(
                                proximaSessao.hora_fim
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                          <Video className="w-5 h-5 shrink-0 text-[#967B62]" />

                          <div>
                            <p className="text-[11px] text-[#7A6F62]">
                              Modalidade
                            </p>

                            <p className="text-xs font-bold text-[#1F3A52]">
                              Não informada
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#F4F0EA] rounded-2xl p-5 border border-[#EBE5DA]">
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 shrink-0 text-[#4A6984] mt-0.5" />

                          <div>
                            <p className="text-[11px] text-[#7A6F62]">
                              Aluno responsável
                            </p>

                            <p className="text-sm font-bold text-[#1F3A52]">
                              {proximaSessao.nome_aluno ||
                                "Informação não disponível"}
                            </p>

                            <p className="text-xs text-[#7A6F62] mt-1">
                              Se precisar de orientações sobre seu
                              atendimento, entre em contato com a
                              equipe da clínica-escola.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-[#F9F6F0] rounded-2xl p-6 border border-[#EBE5DA]">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-6 h-6 shrink-0 text-[#4A6984]" />

                        <div>
                          <h4 className="text-sm font-bold mb-2">
                            Você não possui uma próxima sessão agendada.
                          </h4>

                          <p className="text-xs text-[#7A6F62] leading-relaxed">
                            {sessoes.length > 0
                              ? "Confira o histórico abaixo para consultar os atendimentos anteriores."
                              : "Quando uma sessão for agendada para você, os detalhes aparecerão aqui."}
                          </p>

                          {!solicitacao && (
                            <button
                              onClick={onSolicitarAtendimento}
                              className="mt-4 px-5 py-2.5 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold transition-colors"
                            >
                              Solicitar atendimento
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Outras sessões futuras */}
                {demaisSessoesFuturas.length > 0 && (
                  <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] space-y-4">
                    <h3 className="font-serif text-lg font-bold">
                      Outras sessões agendadas
                    </h3>

                    <div className="space-y-3">
                      {demaisSessoesFuturas.map((sessao) =>
                        renderSessaoCard(sessao)
                      )}
                    </div>
                  </section>
                )}

                {/* Histórico de sessões realizadas */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      Histórico de atendimentos realizados
                    </h3>

                    <p className="text-xs text-[#7A6F62] mt-1">
                      Aqui aparecem as sessões registradas como realizadas.
                    </p>
                  </div>

                  {sessoesRealizadas.length === 0 ? (
                    <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                      <p className="text-sm font-semibold mb-1">
                        Ainda não há atendimentos registrados como realizados.
                      </p>

                      <p className="text-xs text-[#7A6F62] leading-relaxed">
                        Depois que o aluno registrar a realização de uma
                        sessão, ela aparecerá neste histórico.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessoesRealizadas.map((sessao) => (
                        <article
                          key={sessao.id_sessao}
                          className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-[#1F3A52]">
                              Sessão #{sessao.id_sessao}
                            </p>

                            <p className="text-[11px] text-[#7A6F62]">
                              {formatarData(sessao.data_sessao)}{" "}
                              · {formatarHora(sessao.hora_inicio)} às{" "}
                              {formatarHora(sessao.hora_fim)}
                            </p>

                            <p className="text-[11px] text-[#7A6F62]">
                              Aluno responsável:{" "}
                              {sessao.nome_aluno ||
                                "Informação não disponível"}
                            </p>
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#9CAF88]/20 text-[#315D4C]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Realizada
                          </span>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                {/* Sessões passadas ainda sem confirmação */}
                {sessoesAguardandoRegistro.length > 0 && (
                  <section className="bg-white rounded-3xl p-6 border border-[#EBE5DA]">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 shrink-0 text-[#967B62] mt-0.5" />

                      <div>
                        <h3 className="text-sm font-bold mb-1">
                          Sessões aguardando atualização
                        </h3>

                        <p className="text-xs text-[#7A6F62] mb-4">
                          Estes horários já passaram, mas ainda não há
                          confirmação de realização. Isso não significa
                          necessariamente que o atendimento não ocorreu.
                        </p>

                        <div className="space-y-3">
                          {sessoesAguardandoRegistro.map((sessao) =>
                            renderSessaoCard(sessao)
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}
          </section>
        )}

        {/* Aba: Diário de bem-estar */}
        {activeTab === "diario" && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#9CAF88]/20 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-[#4a8b7f]" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold">
                  Diário de bem-estar emocional
                </h3>

                <p className="text-xs text-[#7A6F62] leading-relaxed mt-2">
                  Um espaço para refletir sobre como você está se sentindo.
                  Você pode utilizar este exercício mesmo antes de iniciar
                  um atendimento.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMood} className="space-y-5">
              <fieldset>
                <legend className="text-xs font-semibold mb-3">
                  Como você está se sentindo hoje?
                </legend>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMood("otimo");
                      setMoodSaved(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-semibold transition-colors ${
                      mood === "otimo"
                        ? "bg-[#9CAF88]/25 border-[#4a8b7f] text-[#4a8b7f]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Em paz
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMood("bem");
                      setMoodSaved(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-semibold transition-colors ${
                      mood === "bem"
                        ? "bg-[#9CAF88]/25 border-[#4a8b7f] text-[#4a8b7f]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Smile className="w-4 h-4" />
                    Tranquila
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMood("neutro");
                      setMoodSaved(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-semibold transition-colors ${
                      mood === "neutro"
                        ? "bg-[#A3B8CC]/30 border-[#4A6984] text-[#4A6984]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Meh className="w-4 h-4" />
                    Cansada ou oscilando
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMood("ansiosa");
                      setMoodSaved(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-semibold transition-colors ${
                      mood === "ansiosa"
                        ? "bg-[#B89C85]/30 border-[#967B62] text-[#967B62]"
                        : "bg-[#F9F6F0] border-[#EBE5DA] text-[#7A6F62]"
                    }`}
                  >
                    <Frown className="w-4 h-4" />
                    Ansiosa ou sobrecarregada
                  </button>
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="mood-note"
                  className="block text-xs font-semibold mb-2"
                >
                  Anotações pessoais (opcional)
                </label>

                <textarea
                  id="mood-note"
                  rows={4}
                  value={moodNote}
                  onChange={(e) => {
                    setMoodNote(e.target.value);
                    setMoodSaved(false);
                  }}
                  placeholder="Se quiser, escreva algumas palavras sobre como foi seu dia."
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] focus:outline-none focus:border-[#4a8b7f] resize-y"
                />
              </div>

              <div className="rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] p-3">
                <p className="text-[11px] text-[#7A6F62] leading-relaxed">
                  Este diário ainda é demonstrativo: as informações ficam
                  somente nesta tela e não são gravadas no banco de dados
                  nem enviadas ao terapeuta.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Visualizar registro
                </button>
              </div>

              {moodSaved && (
                <div
                  role="status"
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Registro preparado nesta tela. Ele não foi salvo
                    permanentemente.
                  </span>
                </div>
              )}
            </form>
          </section>
        )}

        {/* Aba: Orientações terapêuticas */}
        {activeTab === "orientacoes" && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#A3B8CC]/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-[#4A6984]" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold">
                  Orientações e exercícios de bem-estar
                </h3>

                <p className="text-xs text-[#7A6F62] leading-relaxed mt-2">
                  Recursos gerais de autocuidado disponíveis para todas
                  as pessoas cadastradas, independentemente de já terem
                  solicitado atendimento.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4a8b7f]">
                  <Sparkles className="w-4 h-4" />
                  Respiração consciente
                </div>

                <p className="text-xs text-[#7A6F62] leading-relaxed">
                  Reserve alguns minutos em um local confortável. Respire
                  naturalmente, prestando atenção ao ar entrando e saindo.
                  Se sua atenção se desviar, retorne gentilmente à respiração.
                </p>

                <p className="text-[11px] text-[#5a7a8a] bg-white p-3 rounded-xl border border-[#EBE5DA]">
                  Faça no seu ritmo e interrompa se sentir desconforto.
                </p>
              </article>

              <article className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4A6984]">
                  <FileText className="w-4 h-4" />
                  Registro de emoções
                </div>

                <p className="text-xs text-[#7A6F62] leading-relaxed">
                  Ao final do dia, reflita sobre uma situação importante,
                  a emoção que sentiu e o que ajudou você a lidar com ela.
                  Não existe uma resposta certa ou errada.
                </p>

                <p className="text-[11px] text-[#5a7a8a] bg-white p-3 rounded-xl border border-[#EBE5DA]">
                  Você pode utilizar o Diário de bem-estar como exercício
                  pessoal.
                </p>
              </article>

              <article className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] space-y-3 md:col-span-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#967B62]">
                  <Heart className="w-4 h-4" />
                  Autocuidado e apoio
                </div>

                <p className="text-xs text-[#7A6F62] leading-relaxed">
                  Procure respeitar seus limites, manter momentos de descanso
                  e buscar apoio de pessoas de confiança quando precisar.
                  Estas orientações são gerais e não substituem avaliação ou
                  acompanhamento profissional.
                </p>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
