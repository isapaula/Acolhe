
import React, { useCallback, useEffect, useState } from "react";
import {
  Users,
  LogOut,
  Calendar,
  Search,
  CalendarPlus,
  ClipboardCheck,
  History,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

import { PsiLogo } from "./PsiLogo";
import { CasesModal } from "./CasesModal";
import { SessionModal } from "./SessionModal";
import {
  SessionCompletionModal,
  type SessionToComplete,
} from "./SessionCompletionModal";

interface StudentPortalProps {
  onLogout: () => void;
}

interface StudentProfile {
  nome: string;
  matricula: number | string;
  semestre: number | string;
}

interface AllocatedPatient {
  id: number;
  patientName: string;
  specialty: string;
  desiredTime: string;
  initialObservation: string | null;
  status: string;
}

interface AssumedCaseResponse {
  id_solicitacao: number;
  nome_paciente: string;
  especialidade: string;
  horario_desejado: string;
  observacao_inicial: string | null;
  solicitacoes_status: string;
}

interface NextSession extends SessionToComplete {}

interface CompletedSession extends SessionToComplete {
  observacao: string | null;
}

interface ApiError {
  erro?: string;
  mensagem?: string;
}

const API_URL = "http://localhost:8080";

function formatSessionDate(date: string, time?: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const sessionDate = new Date(year, month - 1, day);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(sessionDate);

  return time
    ? `${formattedDate} · ${time.slice(0, 5)}`
    : formattedDate;
}

function formatWeekday(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(new Date(year, month - 1, day));
}

async function readApiResponse<T>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    throw new Error(data.erro || data.mensagem || fallbackMessage);
  }

  return data;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onLogout,
}) => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [studentError, setStudentError] = useState<string | null>(null);

  const [patients, setPatients] = useState<AllocatedPatient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  const [nextSession, setNextSession] = useState<NextSession | null>(null);
  const [loadingNextSession, setLoadingNextSession] = useState(true);
  const [nextSessionError, setNextSessionError] = useState<string | null>(
    null
  );

  const [pendingSessions, setPendingSessions] = useState<
    SessionToComplete[]
  >([]);
  const [loadingPendingSessions, setLoadingPendingSessions] = useState(true);
  const [pendingSessionsError, setPendingSessionsError] = useState<
    string | null
  >(null);

  const [completedSessions, setCompletedSessions] = useState<
    CompletedSession[]
  >([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAvailableCasesModal, setShowAvailableCasesModal] =
    useState(false);
  const [sessionToComplete, setSessionToComplete] =
    useState<SessionToComplete | null>(null);

  const selectedPatient =
    patients.find((patient) => patient.id === selectedPatientId) ??
    patients[0] ??
    null;

  const buscarDadosAluno = useCallback(async () => {
    try {
      setLoadingStudent(true);
      setStudentError(null);

      const response = await fetch(`${API_URL}/aluno/dadosAluno`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await readApiResponse<{
        aluno?: StudentProfile;
      }>(response, "Não foi possível carregar os dados do aluno.");

      if (!data.aluno) {
        throw new Error("A API não retornou os dados do aluno.");
      }

      setStudent(data.aluno);
    } catch (error) {
      setStudentError(
        error instanceof Error
          ? error.message
          : "Erro ao consultar os dados do aluno."
      );
    } finally {
      setLoadingStudent(false);
    }
  }, []);

  const buscarCasosAssumidos = useCallback(async () => {
    try {
      setLoadingPatients(true);
      setPatientsError(null);

      const response = await fetch(`${API_URL}/aluno/casosDisponiveis`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await readApiResponse<{
        casos_assumidos?: AssumedCaseResponse[];
      }>(response, "Não foi possível carregar seus pacientes.");

      const mappedPatients: AllocatedPatient[] = (
        data.casos_assumidos ?? []
      ).map((caso) => ({
        id: Number(caso.id_solicitacao),
        patientName: caso.nome_paciente,
        specialty: caso.especialidade,
        desiredTime: caso.horario_desejado,
        initialObservation: caso.observacao_inicial,
        status: caso.solicitacoes_status,
      }));

      setPatients(mappedPatients);

      setSelectedPatientId((currentId) => {
        if (
          currentId !== null &&
          mappedPatients.some((patient) => patient.id === currentId)
        ) {
          return currentId;
        }

        return mappedPatients[0]?.id ?? null;
      });
    } catch (error) {
      setPatientsError(
        error instanceof Error
          ? error.message
          : "Erro ao consultar os pacientes alocados."
      );
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  const buscarProximaSessao = useCallback(async () => {
    try {
      setLoadingNextSession(true);
      setNextSessionError(null);

      const response = await fetch(`${API_URL}/sessao/proximasSessoes`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await readApiResponse<{
        sessoes?: NextSession[];
      }>(response, "Não foi possível carregar a próxima sessão.");

      setNextSession(data.sessoes?.[0] ?? null);
    } catch (error) {
      setNextSession(null);
      setNextSessionError(
        error instanceof Error
          ? error.message
          : "Erro ao consultar a próxima sessão."
      );
    } finally {
      setLoadingNextSession(false);
    }
  }, []);

  const buscarSessoesAguardandoRegistro = useCallback(async () => {
    try {
      setLoadingPendingSessions(true);
      setPendingSessionsError(null);

      const response = await fetch(
        `${API_URL}/sessao/sessoesAguardandoRegistro`,
        {
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      const data = await readApiResponse<{
        sessoes?: SessionToComplete[];
      }>(
        response,
        "Não foi possível carregar as sessões aguardando registro."
      );

      setPendingSessions(data.sessoes ?? []);
    } catch (error) {
      setPendingSessionsError(
        error instanceof Error
          ? error.message
          : "Erro ao consultar as sessões aguardando registro."
      );
    } finally {
      setLoadingPendingSessions(false);
    }
  }, []);

  const buscarHistoricoSessoes = useCallback(async () => {
    try {
      setLoadingHistory(true);
      setHistoryError(null);

      const response = await fetch(
        `${API_URL}/sessao/sessoesRealizadasAluno`,
        {
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      const data = await readApiResponse<{
        sessoes?: CompletedSession[];
      }>(
        response,
        "Não foi possível carregar o histórico de sessões."
      );

      setCompletedSessions(data.sessoes ?? []);
    } catch (error) {
      setHistoryError(
        error instanceof Error
          ? error.message
          : "Erro ao consultar o histórico de sessões."
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const atualizarSessoes = useCallback(() => {
    void buscarProximaSessao();
    void buscarSessoesAguardandoRegistro();
    void buscarHistoricoSessoes();
  }, [
    buscarProximaSessao,
    buscarSessoesAguardandoRegistro,
    buscarHistoricoSessoes,
  ]);

  useEffect(() => {
    void buscarDadosAluno();
    void buscarCasosAssumidos();
    atualizarSessoes();
  }, [buscarDadosAluno, buscarCasosAssumidos, atualizarSessoes]);

  const renderRetryButton = (action: () => void) => (
    <button
      type="button"
      onClick={action}
      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#4A6984] hover:underline"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Tentar novamente
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F0] pb-16 text-[#1F3A52]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EBE5DA] bg-white px-4 py-3.5 sm:px-8">
        <div className="flex items-center gap-3">
          <PsiLogo size="sm" variant="measured" />

          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F3A52]">
              Portal do Aluno Estagiário
            </h3>

            <p className="text-[11px] text-[#5a7a8a]">
              {loadingStudent
                ? "Carregando dados do aluno..."
                : student
                  ? `${student.nome} • RA - ${student.matricula} • ${student.semestre}º Semestre`
                  : "Dados do aluno indisponíveis"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[#7A6F62] transition-colors hover:bg-[#F4F0EA]"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 pt-8 sm:px-6 lg:px-8">
        {studentError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {studentError}
            {renderRetryButton(() => void buscarDadosAluno())}
          </div>
        )}

        {patientsError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {patientsError}
            {renderRetryButton(() => void buscarCasosAssumidos())}
          </div>
        )}

        {/* Visão geral */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-3xl border border-[#EBE5DA] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Pacientes em acompanhamento</span>
              <Users className="h-4 w-4 text-[#4A6984]" />
            </div>

            <p className="font-serif text-2xl font-bold text-[#1F3A52]">
              {loadingPatients ? (
                <span className="text-sm font-normal text-[#7A6F62]">
                  Carregando...
                </span>
              ) : (
                <>
                  {patients.length}{" "}
                  <span className="text-sm font-normal text-[#7A6F62]">
                    {patients.length === 1 ? "ativo" : "ativos"}
                  </span>
                </>
              )}
            </p>

            <p className="text-[10px] text-[#5a7a8a]">
              Total de pacientes vinculados a você.
            </p>
          </div>

          <div className="space-y-2 rounded-3xl border border-[#EBE5DA] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Próxima sessão</span>
              <Calendar className="h-4 w-4 text-[#967B62]" />
            </div>

            {loadingNextSession ? (
              <p className="text-sm text-[#7A6F62]">
                Carregando próxima sessão...
              </p>
            ) : nextSession ? (
              <>
                <p className="font-serif text-lg font-bold text-[#1F3A52]">
                  {nextSession.nome_paciente}
                </p>
                <p className="text-xs capitalize text-[#5a7a8a]">
                  {formatWeekday(nextSession.data_sessao)},{" "}
                  {formatSessionDate(nextSession.data_sessao)}
                </p>
                <p className="text-xs text-[#7A6F62]">
                  {nextSession.hora_inicio.slice(0, 5)} às{" "}
                  {nextSession.hora_fim.slice(0, 5)}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#7A6F62]">
                {nextSessionError
                  ? "Não foi possível carregar a próxima sessão."
                  : "Você não possui sessões futuras agendadas."}
              </p>
            )}

            {nextSessionError &&
              renderRetryButton(() => void buscarProximaSessao())}
          </div>
        </section>

        {/* Pacientes alocados */}
        <section className="space-y-4 rounded-3xl border border-[#EBE5DA] bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-col gap-3 border-b border-[#F4F0EA] pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-[#1F3A52]">
                <Users className="h-4 w-4 text-[#4a8b7f]" />
                Seus pacientes alocados
              </h3>

              <span className="rounded-full bg-[#F9F6F0] px-2 py-0.5 text-[11px] text-[#7A6F62]">
                {patients.length} {patients.length === 1 ? "caso" : "casos"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAvailableCasesModal(true)}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1F3A52] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4A6984]"
            >
              <Search className="h-4 w-4" />
              Ver casos disponíveis
            </button>
          </div>

          {loadingPatients ? (
            <p className="py-10 text-center text-sm text-[#7A6F62]">
              Carregando pacientes...
            </p>
          ) : patients.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-[#A3B8CC]" />
              <p className="text-sm font-semibold text-[#1F3A52]">
                Você ainda não possui pacientes alocados.
              </p>
              <p className="mt-2 text-xs text-[#7A6F62]">
                Consulte os casos disponíveis para encontrar pacientes que
                você possa assumir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.7fr)]">
              <div className="space-y-2">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#7A6F62]">
                  Pacientes vinculados
                </h5>

                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => setSelectedPatientId(patient.id)}
                    aria-pressed={selectedPatient?.id === patient.id}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      selectedPatient?.id === patient.id
                        ? "border-[#4A6984] bg-[#EEF3F6]"
                        : "border-[#EBE5DA] bg-white hover:bg-[#F9F6F0]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1F3A52]">
                        {patient.patientName}
                      </span>
                      <span className="text-xs text-[#4A6984]" aria-hidden>
                        {selectedPatient?.id === patient.id ? "●" : "○"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#7A6F62]">
                      {patient.specialty || "Especialidade não informada"}
                    </p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-[#EBE5DA] bg-[#F9F6F0] p-5 sm:p-6">
                {selectedPatient && (
                  <>
                    <div className="flex flex-col gap-3 border-b border-[#EBE5DA] pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="mb-1 text-xs text-[#7A6F62]">
                          Detalhes do paciente
                        </p>
                        <h3 className="font-serif text-xl font-bold text-[#1F3A52]">
                          {selectedPatient.patientName}
                        </h3>
                      </div>

                      <span className="self-start rounded-full border border-[#EBE5DA] bg-white px-3 py-1 text-xs text-[#4A6984]">
                        {selectedPatient.status || "Status não informado"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs text-[#7A6F62]">
                          Especialidade
                        </p>
                        <p className="text-sm font-semibold text-[#1F3A52]">
                          {selectedPatient.specialty || "Não informada"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-[#7A6F62]">
                          Horário desejado
                        </p>
                        <p className="text-sm font-semibold text-[#1F3A52]">
                          {selectedPatient.desiredTime || "Não informado"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-[#7A6F62]">
                        Observação inicial
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1F3A52]">
                        {selectedPatient.initialObservation?.trim() ||
                          "Nenhuma observação inicial registrada."}
                      </p>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-[#EBE5DA] pt-5">
                      <button
                        type="button"
                        onClick={() => setShowSessionModal(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4a8b7f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d756b] focus:outline-none focus:ring-2 focus:ring-[#4a8b7f] focus:ring-offset-2"
                      >
                        <CalendarPlus className="h-[18px] w-[18px]" />
                        Marcar sessão
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Sessões que terminaram e aguardam registro */}
        <section className="space-y-4 rounded-3xl border border-[#EBE5DA] bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F0EA]">
              <ClipboardCheck className="h-5 w-5 text-[#4A6984]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#1F3A52]">
                Sessões aguardando registro
              </h3>
              <p className="mt-1 text-xs text-[#7A6F62]">
                Registre as sessões que já terminaram.
              </p>
            </div>
          </div>

          {loadingPendingSessions ? (
            <p className="py-6 text-center text-sm text-[#7A6F62]">
              Carregando sessões...
            </p>
          ) : pendingSessionsError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {pendingSessionsError}
              {renderRetryButton(() =>
                void buscarSessoesAguardandoRegistro()
              )}
            </div>
          ) : pendingSessions.length === 0 ? (
            <div className="rounded-2xl bg-[#F9F6F0] px-4 py-8 text-center">
              <CheckCircle className="mx-auto mb-2 h-7 w-7 text-[#4a8b7f]" />
              <p className="text-sm font-semibold text-[#1F3A52]">
                Nenhuma sessão aguardando registro.
              </p>
              <p className="mt-1 text-xs text-[#7A6F62]">
                Quando uma sessão agendada terminar, ela aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {pendingSessions.map((session) => (
                <article
                  key={session.id_sessao}
                  className="rounded-2xl border border-[#EBE5DA] bg-[#F9F6F0] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#1F3A52]">
                        {session.nome_paciente}
                      </h3>
                      <p className="mt-1 text-xs capitalize text-[#5a7a8a]">
                        {formatWeekday(session.data_sessao)},{" "}
                        {formatSessionDate(session.data_sessao)}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#7A6F62]">
                        <Clock className="h-3.5 w-3.5" />
                        {session.hora_inicio.slice(0, 5)} às{" "}
                        {session.hora_fim.slice(0, 5)}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#F1E7D6] px-2.5 py-1 text-[10px] font-semibold text-[#806641]">
                      Aguardando registro
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSessionToComplete(session)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4a8b7f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d756b]"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Registrar realização
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Histórico de sessões realizadas */}
        <section className="space-y-4 rounded-3xl border border-[#EBE5DA] bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3EEE8]">
              <History className="h-5 w-5 text-[#4a8b7f]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#1F3A52]">
                Histórico de sessões realizadas
              </h3>
              <p className="mt-1 text-xs text-[#7A6F62]">
                Consulte as sessões concluídas e suas observações.
              </p>
            </div>
          </div>

          {loadingHistory ? (
            <p className="py-6 text-center text-sm text-[#7A6F62]">
              Carregando histórico...
            </p>
          ) : historyError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {historyError}
              {renderRetryButton(() => void buscarHistoricoSessoes())}
            </div>
          ) : completedSessions.length === 0 ? (
            <div className="rounded-2xl bg-[#F9F6F0] px-4 py-8 text-center">
              <History className="mx-auto mb-2 h-7 w-7 text-[#A3B8CC]" />
              <p className="text-sm font-semibold text-[#1F3A52]">
                Nenhuma sessão realizada até o momento.
              </p>
              <p className="mt-1 text-xs text-[#7A6F62]">
                As sessões registradas como realizadas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedSessions.map((session) => (
                <article
                  key={session.id_sessao}
                  className="rounded-2xl border border-[#EBE5DA] p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-[#1F3A52]">
                        {session.nome_paciente}
                      </h4>
                      <p className="mt-1 text-xs capitalize text-[#5a7a8a]">
                        {formatWeekday(session.data_sessao)},{" "}
                        {formatSessionDate(session.data_sessao)}
                      </p>
                      <p className="mt-1 text-xs text-[#7A6F62]">
                        {session.hora_inicio.slice(0, 5)} às{" "}
                        {session.hora_fim.slice(0, 5)}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 self-start rounded-full bg-[#E3EEE8] px-3 py-1 text-xs font-semibold text-[#3d756b]">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Realizada
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-[#F9F6F0] p-3">
                    <p className="mb-1 text-xs font-semibold text-[#7A6F62]">
                      Observação da sessão
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1F3A52]">
                      {session.observacao?.trim() ||
                        "Nenhuma observação registrada."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        patientName={selectedPatient?.patientName ?? ""}
        solicitationId={selectedPatient?.id ?? 0}
        onSuccess={() => {
          atualizarSessoes();
        }}
      />

      <SessionCompletionModal
        session={sessionToComplete}
        onClose={() => setSessionToComplete(null)}
        onSuccess={() => {
          atualizarSessoes();
        }}
      />

      <CasesModal
        isOpen={showAvailableCasesModal}
        onClose={() => setShowAvailableCasesModal(false)}
      />
    </div>
  );
};
