
import React, { useEffect, useState } from "react";
import { PsiLogo } from "./PsiLogo";
import { Users, LogOut, Calendar, Search } from "lucide-react";
import { CasesModal } from "./CasesModal";

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

interface NextSession {
  patientName: string;
  date: string;
  time: string;
}

interface AssumedCaseResponse {
  id_solicitacao: number;
  nome_paciente: string;
  especialidade: string;
  horario_desejado: string;
  observacao_inicial: string | null;
  solicitacoes_status: string;
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

  const [selectedPatientId, setSelectedPatientId] =
    useState<number | null>(null);

  const [nextSession] = useState<NextSession | null>(null);

  const [showAvailableCasesModal, setShowAvailableCasesModal] =
    useState(false);

  const selectedPatient =
    patients.find((patient) => patient.id === selectedPatientId) ??
    patients[0] ??
    null;

  useEffect(() => {
    const buscarDadosAluno = async () => {
      try {
        setLoadingStudent(true);
        setStudentError(null);

        const response = await fetch(
          "http://localhost:8080/aluno/dadosAluno",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data: {
          aluno?: StudentProfile;
          erro?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.erro || "Não foi possível carregar os dados do aluno."
          );
        }

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
    };

    const buscarCasosAssumidos = async () => {
      try {
        setLoadingPatients(true);
        setPatientsError(null);

        const response = await fetch(
          "http://localhost:8080/aluno/casosDisponiveis",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data: {
          casos_assumidos?: AssumedCaseResponse[];
          erro?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.erro || "Não foi possível carregar seus pacientes."
          );
        }

        const pacientesAlocados: AllocatedPatient[] = (
          data.casos_assumidos ?? []
        ).map((caso) => ({
          id: Number(caso.id_solicitacao),
          patientName: caso.nome_paciente,
          specialty: caso.especialidade,
          desiredTime: caso.horario_desejado,
          initialObservation: caso.observacao_inicial,
          status: caso.solicitacoes_status,
        }));

        setPatients(pacientesAlocados);

        setSelectedPatientId((currentId) => {
          if (
            currentId !== null &&
            pacientesAlocados.some(
              (patient) => patient.id === currentId
            )
          ) {
            return currentId;
          }

          return pacientesAlocados[0]?.id ?? null;
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
    };

    void buscarDadosAluno();
    void buscarCasosAssumidos();
  }, []);

  const formatSessionDate = (date: string, time: string) => {
    const [year, month, day] = date.split("-").map(Number);
    const sessionDate = new Date(year, month - 1, day);

    const weekday = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
    }).format(sessionDate);

    return `${weekday}, ${time.slice(0, 5)}`;
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1F3A52] pb-16">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-[#EBE5DA] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PsiLogo size="sm" variant="measured" />

          <div>
            <div className="font-serif text-lg font-bold text-[#1F3A52]">
              Portal do Aluno Estagiário
            </div>

            <div className="text-[11px] text-[#5a7a8a]">
              {loadingStudent ? (
                "Carregando dados do aluno..."
              ) : student ? (
                <>
                  {student.nome} • RA - {student.matricula} •{" "}
                  {student.semestre}º Semestre
                </>
              ) : (
                "Dados do aluno indisponíveis"
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#F4F0EA] text-xs font-semibold text-[#7A6F62] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Erro ao carregar o perfil */}
        {studentError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            {studentError}
          </div>
        )}

        {/* Erro ao carregar os pacientes */}
        {patientsError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {patientsError}
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-4 ${
            nextSession ? "sm:grid-cols-2" : ""
          }`}
        >
          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Pacientes em Acompanhamento</span>
              <Users className="w-4 h-4 text-[#4A6984]" />
            </div>

            <div className="font-serif text-2xl font-bold text-[#1F3A52]">
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
            </div>

            <div className="text-[10px] text-[#5a7a8a]">
              Total de pacientes vinculados a você.
            </div>
          </div>

          {/* Próxima consulta */}
          {nextSession && (
            <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-[#7A6F62]">
                <span>Próxima consulta</span>
                <Calendar className="w-4 h-4 text-[#967B62]" />
              </div>

              <div className="font-serif text-lg font-bold text-[#1F3A52]">
                {nextSession.patientName}
              </div>

              <div className="text-xs text-[#5a7a8a]">
                {formatSessionDate(
                  nextSession.date,
                  nextSession.time
                )}
              </div>
            </div>
          )}
        </div>


        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EBE5DA] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F4F0EA] pb-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-base font-bold text-[#1F3A52] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4a8b7f]" />
                <span>Seus Pacientes Alocados</span>
              </h3>

              <span className="text-[11px] text-[#7A6F62] bg-[#F9F6F0] px-2 py-0.5 rounded-full">
                {patients.length}{" "}
                {patients.length === 1 ? "caso" : "casos"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAvailableCasesModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F3A52] text-white text-sm font-semibold hover:bg-[#4A6984] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Ver casos disponíveis
            </button>
          </div>

          {loadingPatients ? (
            <div className="py-10 text-center text-sm text-[#7A6F62]">
              Carregando pacientes...
            </div>
          ) : patients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.7fr)] gap-5">

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[#7A6F62] mb-3">
                  Pacientes vinculados
                </h4>

                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => setSelectedPatientId(patient.id)}
                    aria-pressed={selectedPatient?.id === patient.id}
                    className={`w-full text-left p-4 rounded-2xl border transition-colors ${
                      selectedPatient?.id === patient.id
                        ? "bg-[#EEF3F6] border-[#4A6984]"
                        : "bg-white border-[#EBE5DA] hover:bg-[#F9F6F0]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1F3A52]">
                        {patient.patientName}
                      </span>

                      <span
                        className="text-[#4A6984] text-xs"
                        aria-hidden="true"
                      >
                        {selectedPatient?.id === patient.id
                          ? "●"
                          : "○"}
                      </span>
                    </div>

                    <p className="text-xs text-[#7A6F62] mt-2">
                      {patient.specialty ||
                        "Especialidade não informada"}
                    </p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-[#EBE5DA] bg-[#F9F6F0] p-5 sm:p-6">
                {selectedPatient && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#EBE5DA]">
                      <div>
                        <p className="text-xs text-[#7A6F62] mb-1">
                          Detalhes do paciente
                        </p>

                        <h4 className="font-serif text-xl font-bold text-[#1F3A52]">
                          {selectedPatient.patientName}
                        </h4>
                      </div>

                      <span className="self-start rounded-full bg-white border border-[#EBE5DA] px-3 py-1 text-xs text-[#4A6984]">
                        {selectedPatient.status ||
                          "Status não informado"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
                      <div>
                        <p className="text-xs text-[#7A6F62] mb-1">
                          Especialidade
                        </p>

                        <p className="text-sm font-semibold text-[#1F3A52]">
                          {selectedPatient.specialty ||
                            "Não informada"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#7A6F62] mb-1">
                          Horário desejado
                        </p>

                        <p className="text-sm font-semibold text-[#1F3A52]">
                          {selectedPatient.desiredTime || "Não informado"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#7A6F62] mb-2">
                        Observação inicial
                      </p>

                      <p className="text-sm leading-relaxed text-[#1F3A52] whitespace-pre-wrap">
                        {selectedPatient.initialObservation?.trim() ||
                          "Nenhuma observação inicial registrada."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="py-10 px-4 text-center">
              <Users className="w-8 h-8 text-[#A3B8CC] mx-auto mb-3" />

              <p className="text-sm font-semibold text-[#1F3A52]">
                Você ainda não possui pacientes alocados.
              </p>

              <p className="text-xs text-[#7A6F62] mt-2">
                Consulte os casos disponíveis para encontrar pacientes
                que você possa assumir.
              </p>
            </div>
          )}
        </section>
      </main>

      <CasesModal
        isOpen={showAvailableCasesModal}
        onClose={() => setShowAvailableCasesModal(false)}
      />
    </div>
  );
};
