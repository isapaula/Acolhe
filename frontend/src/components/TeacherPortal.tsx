
import React, { useEffect, useState } from "react";
import { PsiLogo } from "./PsiLogo";
import {
  Users,
  Clock,
  FileCheck2,
  LogOut,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

interface Solicitacao {
  id_solicitacao: number;
  id_paciente: number;
  especialidade: string;
  horario_desejado: string;
  observacao_inicial: string | null;
  solicitacoes_status: string;
  created_at: string;
  nome_paciente: string;
  nome_aluno: string | null;
}

interface TeacherPortalProps {
  onLogout: () => void;
}

interface RespostaSolicitacoes {
  solicitacoes: Solicitacao[];
}

interface RespostaAcao {
  mensagem?: string;
  erro?: string;
}

const formatarData = (data: string) => {
  const [ano, mes, dia] = data.split(" ")[0].split("-");
  return `${dia}/${mes}/${ano}`;
};

const formatarStatus = (status: string) => {
  const statusLegiveis: Record<string, string> = {
    AGUARDANDO_TRIAGEM: "Aguardando triagem",
    RECUSADA: "Recusada",
    APROVADA: "Aprovada",
    ASSUMIDA: "Assumida",
    EM_ATENDIMENTO: "Em atendimento",
  };

  return statusLegiveis[status] ?? status.replaceAll("_", " ");
};

const obterCorStatus = (status: string) => {
  switch (status) {
    case "AGUARDANDO_TRIAGEM":
      return "bg-amber-100 text-amber-800";
    case "RECUSADA":
      return "bg-red-100 text-red-800";
    case "APROVADA":
      return "bg-emerald-100 text-emerald-800";
    case "ASSUMIDA":
    case "EM_ATENDIMENTO":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onLogout,
}) => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
    useState<Solicitacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [processandoAcao, setProcessandoAcao] = useState(false);
  const [mensagemAcao, setMensagemAcao] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  const carregarSolicitacoes = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await fetch(
        "http://localhost:8080/solicitacao/status",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro ??
            dados.mensagem ??
            "Não foi possível carregar as solicitações."
        );
      }

      const resultado = dados as RespostaSolicitacoes;

      if (!Array.isArray(resultado.solicitacoes)) {
        throw new Error(
          "A resposta da API não contém uma lista válida."
        );
      }

      setSolicitacoes(resultado.solicitacoes);

      setSolicitacaoSelecionada((selecionada) => {
        if (!selecionada) {
          return resultado.solicitacoes[0] ?? null;
        }

        return (
          resultado.solicitacoes.find(
            (item) =>
              item.id_solicitacao === selecionada.id_solicitacao
          ) ??
          resultado.solicitacoes[0] ??
          null
        );
      });
    } catch (erroDesconhecido) {
      setErro(
        erroDesconhecido instanceof Error
          ? erroDesconhecido.message
          : "Ocorreu um erro inesperado."
      );
    } finally {
      setCarregando(false);
    }
  };

  const analisarSolicitacao = async (
    acao: "aprovar" | "recusar"
  ) => {
    if (!solicitacaoSelecionada || processandoAcao) {
      return;
    }

    const idSolicitacao = solicitacaoSelecionada.id_solicitacao;

    setProcessandoAcao(true);
    setMensagemAcao(null);

    try {
      const resposta = await fetch(
        `http://localhost:8080/solicitacao/${acao}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_solicitacao: idSolicitacao,
          }),
        }
      );

      const dados: RespostaAcao = await resposta
        .json()
        .catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.erro ??
            dados.mensagem ??
            "Não foi possível atualizar a solicitação."
        );
      }

      setMensagemAcao({
        tipo: "sucesso",
        texto:
          dados.mensagem ??
          (acao === "aprovar"
            ? "Solicitação aprovada com sucesso."
            : "Solicitação recusada com sucesso."),
      });

      await carregarSolicitacoes();
    } catch (erroDesconhecido) {
      setMensagemAcao({
        tipo: "erro",
        texto:
          erroDesconhecido instanceof Error
            ? erroDesconhecido.message
            : "Ocorreu um erro inesperado.",
      });
    } finally {
      setProcessandoAcao(false);
    }
  };

  useEffect(() => {
    void carregarSolicitacoes();
  }, []);

  const pendentes = solicitacoes.filter(
    (item) => item.solicitacoes_status === "AGUARDANDO_TRIAGEM"
  ).length;

  const recusadas = solicitacoes.filter(
    (item) => item.solicitacoes_status === "RECUSADA"
  ).length;

  const assumidas = solicitacoes.filter(
    (item) => item.solicitacoes_status === "ASSUMIDA"
  ).length;

  const aprovadas = solicitacoes.filter(
    (item) => item.solicitacoes_status === "APROVADA"
  ).length;

  const emAtendimento = solicitacoes.filter(
    (item) => item.solicitacoes_status === "EM_ATENDIMENTO"
  ).length;

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1F3A52] pb-16">
      <header className="bg-white border-b border-[#EBE5DA] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PsiLogo size="sm" variant="measured" />

          <div>
            <div className="font-serif text-lg font-bold text-[#1F3A52]">
              Painel do Professor Supervisor
            </div>
            <div className="text-[11px] text-[#5a7a8a]">
              Gestão de solicitações de atendimento
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#F4F0EA] text-xs font-semibold text-[#7A6F62] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Indicadores de solicitações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Total de solicitações</span>
              <Users className="w-4 h-4 text-[#5a7a8a]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#1F3A52]">
              {solicitacoes.length}
            </div>
            <div className="text-[10px] text-[#5a7a8a]">
              Solicitações retornadas pela API
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Aguardando triagem</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-amber-700">
              {pendentes}
            </div>
            <div className="text-[10px] text-[#7A6F62]">
              Aguardam análise do professor
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Solicitações recusadas</span>
              <FileCheck2 className="w-4 h-4 text-red-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-red-700">
              {recusadas}
            </div>
            <div className="text-[10px] text-[#5a7a8a]">
              Solicitações recusadas
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Solicitações assumidas</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-blue-700">
              {assumidas}
            </div>
            <div className="text-[10px] text-[#5a7a8a]">
              Casos assumidos pelos alunos
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Solicitações aprovadas</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-emerald-700">
              {aprovadas}
            </div>
            <div className="text-[10px] text-[#5a7a8a]">
              Solicitações com status aprovado
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Em atendimento</span>
              <Clock className="w-4 h-4 text-[#4a8b7f]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#1F3A52]">
              {emAtendimento}
            </div>
            <div className="text-[10px] text-[#5a7a8a]">
              Solicitações em atendimento
            </div>
          </div>
        </div>

        {/* Fila e detalhes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F0EA] pb-3">
              <h2 className="font-serif text-base font-bold text-[#1F3A52] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#4a8b7f]" />
                Fila de solicitações
              </h2>

              <button
                onClick={() => void carregarSolicitacoes()}
                disabled={carregando}
                title="Atualizar solicitações"
                className="p-2 rounded-full hover:bg-[#F4F0EA] disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    carregando ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            {carregando && (
              <p className="text-sm text-[#5a7a8a] py-4">
                Carregando solicitações...
              </p>
            )}

            {!carregando && erro && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{erro}</p>
                </div>

                <button
                  onClick={() => void carregarSolicitacoes()}
                  className="font-semibold underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!carregando && !erro && solicitacoes.length === 0 && (
              <p className="text-sm text-[#5a7a8a] py-4">
                Nenhuma solicitação foi encontrada.
              </p>
            )}

            {!carregando && !erro && solicitacoes.length > 0 && (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
                {solicitacoes.map((solicitacao) => {
                  const selecionada =
                    solicitacaoSelecionada?.id_solicitacao ===
                    solicitacao.id_solicitacao;

                  return (
                    <button
                      key={solicitacao.id_solicitacao}
                      onClick={() => {
                        setSolicitacaoSelecionada(solicitacao);
                        setMensagemAcao(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selecionada
                          ? "bg-[#4A6984]/10 border-[#4A6984] shadow-xs"
                          : "bg-white hover:bg-[#F9F6F0] border-[#EBE5DA]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-bold text-[#1F3A52]">
                          {solicitacao.nome_paciente}
                        </div>

                        <span
                          className={`shrink-0 text-[9px] font-bold px-2 py-1 rounded-full ${obterCorStatus(
                            solicitacao.solicitacoes_status
                          )}`}
                        >
                          {formatarStatus(
                            solicitacao.solicitacoes_status
                          )}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-[#5a7a8a]">
                        Solicitação #{solicitacao.id_solicitacao}
                      </div>

                      <div className="mt-1 text-[11px] text-[#7A6F62] line-clamp-2">
                        {solicitacao.especialidade}
                      </div>
                      <div className="mt-2 text-[11px] text-[#5a7a8a]">
                          <span className="font-semibold">Aluno responsável: </span>
                          {solicitacao.nome_aluno?.trim() ||
                            (solicitacao.solicitacoes_status === "RECUSADA"
                              ? "Nenhum aluno atribuído — solicitação recusada"
                              : "Sem aluno atribuído")}
                        </div>

                      <div className="mt-2 text-[10px] text-[#7A6F62]">
                        Criada em {formatarData(solicitacao.created_at)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] shadow-xs space-y-6">
            {!solicitacaoSelecionada ? (
              <div className="py-12 text-center text-sm text-[#5a7a8a]">
                {carregando
                  ? "Aguardando dados da API..."
                  : "Selecione uma solicitação para visualizar os detalhes."}
              </div>
            ) : (
              <>
                <div className="border-b border-[#F4F0EA] pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a7a8a]">
                    Detalhes da solicitação
                  </span>

                  <h2 className="font-serif text-2xl font-bold text-[#1F3A52] mt-1">
                    {solicitacaoSelecionada.nome_paciente}
                  </h2>

                  <div className="text-xs text-[#7A6F62] mt-2">
                    Solicitação #{solicitacaoSelecionada.id_solicitacao}
                  </div>

                  <span
                    className={`inline-block mt-3 text-xs font-bold px-3 py-1.5 rounded-full ${obterCorStatus(
                      solicitacaoSelecionada.solicitacoes_status
                    )}`}
                  >
                    {formatarStatus(
                      solicitacaoSelecionada.solicitacoes_status
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                    <span className="text-[#7A6F62] block text-[11px]">
                      Especialidade
                    </span>
                    <strong className="text-sm text-[#1F3A52]">
                      {solicitacaoSelecionada.especialidade}
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                    <span className="text-[#7A6F62] block text-[11px]">
                      Horário desejado
                    </span>
                    <strong className="text-sm text-[#1F3A52]">
                      {solicitacaoSelecionada.horario_desejado}
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] sm:col-span-2">
                    <span className="text-[#7A6F62] block text-[11px]">
                      Data da solicitação
                    </span>
                    <strong className="text-sm text-[#1F3A52]">
                      {formatarData(
                        solicitacaoSelecionada.created_at
                      )}
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA]">
                  <span className="text-[#7A6F62] block text-[11px]">
                    Aluno responsável
                  </span>

                  <strong className="text-sm text-[#1F3A52]">
                    {solicitacaoSelecionada.nome_aluno?.trim() ||
                      (solicitacaoSelecionada.solicitacoes_status === "RECUSADA"
                        ? "Nenhum aluno atribuído — solicitação recusada"
                        : "Sem aluno atribuído")}
                  </strong>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#1F3A52] uppercase tracking-wide">
                    Observação inicial do paciente
                  </h4>

                  <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] text-sm text-[#1F3A52] leading-relaxed whitespace-pre-wrap">
                    {solicitacaoSelecionada.observacao_inicial?.trim() ||
                      "Nenhuma observação informada."}
                  </div>
                </div>

                {mensagemAcao && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`p-4 rounded-xl border text-sm ${
                      mensagemAcao.tipo === "sucesso"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {mensagemAcao.texto}
                  </div>
                )}

                {solicitacaoSelecionada.solicitacoes_status ===
                "AGUARDANDO_TRIAGEM" ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => void analisarSolicitacao("aprovar")}
                      disabled={processandoAcao || carregando}
                      className="flex-1 rounded-xl bg-[#3D756B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#315F57] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processandoAcao
                        ? "Processando..."
                        : "Aprovar solicitação"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void analisarSolicitacao("recusar")}
                      disabled={processandoAcao || carregando}
                      className="flex-1 rounded-xl bg-[#1F3A52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#162B3D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processandoAcao
                        ? "Processando..."
                        : "Recusar solicitação"}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] p-4 text-sm text-[#5a7a8a]">
                    Esta solicitação já foi analisada. Não há ações disponíveis.
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
