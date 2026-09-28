import React, { useState } from "react";
import { PsiLogo } from "./PsiLogo";
import { mockPatients, currentProfessor } from "../data/initialData";
import { PatientRecord } from "../types";
import { 
  Award, 
  Users, 
  CheckCircle, 
  Clock, 
  FileCheck2, 
  Sparkles, 
  AlertCircle, 
  LogOut, 
  Check, 
  X,
  Search
} from "lucide-react";

interface TeacherPortalProps {
  onLogout: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onLogout,
}) => {
  const [patients, setPatients] = useState<PatientRecord[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(mockPatients[2]); // Clara Beatriz
  const [feedbackText, setFeedbackText] = useState(
    "Excelente acolhimento e manejo da anamnese. Sugiro aprofundar na próxima sessão a relação entre as expectativas familiares e as respostas de ansiedade."
  );
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);

  const pendingApprovalCount = patients.filter(
    (p) => !p.supervisorSigned
  ).length;

  const handleApprove = () => {
    setApprovalStatus("approved");
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? {
              ...p,
              supervisorSigned: true,
            }
          : p
      )
    );
    setTimeout(() => setApprovalStatus(null), 3000);
  };

  const handleRequestRevision = () => {
    setApprovalStatus("revision");
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? {
              ...p,
              supervisorSigned: false,
            }
          : p
      )
    );
    setTimeout(() => setApprovalStatus(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1F3A52] pb-16">
      {/* Header */}
      <header className="bg-white border-b border-[#EBE5DA] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PsiLogo size="sm" variant="measured" />
          <div>
            <div className="font-serif text-lg font-bold text-[#1F3A52]">
              Painel do Professor Supervisor
            </div>
            <div className="text-[11px] text-[#5a7a8a]">
              {currentProfessor.name} • {currentProfessor.crp} • {currentProfessor.title}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Alunos Sob Orientação</span>
              <Users className="w-4 h-4 text-[#5a7a8a]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#1F3A52]">
              {currentProfessor.supervisedStudentsCount} Estagiários
            </div>
            <div className="text-[10px] text-[#5a7a8a]">{currentProfessor.department}</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Prontuários Para Visto</span>
              <FileCheck2 className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-amber-700">
              {pendingApprovalCount} pendentes
            </div>
            <div className="text-[10px] text-[#7A6F62]">Necessitam validação docente semanal</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Casos Ativos da Clínica</span>
              <Clock className="w-4 h-4 text-[#4a8b7f]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#1F3A52]">
              {currentProfessor.activeCasesCount} Casos
            </div>
            <div className="text-[10px] text-[#5a7a8a]">100% gratuitos para a comunidade</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Conformidade Ética CFP</span>
              <Award className="w-4 h-4 text-[#967B62]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#4a8b7f]">
              100% Homologado
            </div>
            <div className="text-[10px] text-[#5a7a8a]">Termos e prontuários atualizados</div>
          </div>
        </div>

        {/* Supervision Workspace: Review queue and approval flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Caseload & Pending Review Queue (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F0EA] pb-3">
              <h3 className="font-serif text-base font-bold text-[#1F3A52] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#4a8b7f]" />
                <span>Fila de Supervisão Clínica</span>
              </h3>
              <span className="text-[11px] text-[#7A6F62] bg-[#F9F6F0] px-2 py-0.5 rounded-full">
                {patients.length} casos
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {patients.map((patient) => {
                const isSelected = selectedPatient.id === patient.id;
                return (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#4A6984]/10 border-[#4A6984] shadow-xs"
                        : "bg-white hover:bg-[#F9F6F0] border-[#EBE5DA]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#1F3A52]">
                        {patient.patientName} ({patient.age} anos)
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          !patient.supervisorSigned
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {patient.supervisorSigned ? "Homologado" : "Pendente de Visto"}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#5a7a8a] mt-1">
                      Estudante: <strong>{patient.allocatedStudent}</strong>
                    </div>

                    <div className="mt-1 text-[11px] text-[#7A6F62] line-clamp-1">
                      Demanda: {patient.mainComplaint}
                    </div>

                    <div className="mt-2 text-[10px] text-[#7A6F62] flex items-center justify-between">
                      <span>{patient.clinicalApproach}</span>
                      <span>{patient.modality}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Details & Docente Sign-off (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4F0EA] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5a7a8a]">
                  Avaliação Pedagógica de Prontuário
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F3A52]">
                  Caso: {selectedPatient.patientName}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#7A6F62]">Estudante-Terapeuta:</span>
                <div className="text-xs font-bold text-[#1F3A52]">
                  {selectedPatient.allocatedStudent}
                </div>
              </div>
            </div>

            {/* Case Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] text-xs">
              <div>
                <span className="text-[#7A6F62] block text-[11px]">Queixa e Sintomas:</span>
                <strong className="text-[#1F3A52]">{selectedPatient.mainComplaint}</strong>
              </div>
              <div>
                <span className="text-[#7A6F62] block text-[11px]">Abordagem:</span>
                <strong className="text-[#1F3A52]">{selectedPatient.clinicalApproach}</strong>
              </div>
              <div>
                <span className="text-[#7A6F62] block text-[11px]">Modalidade:</span>
                <strong className="text-[#1F3A52]">{selectedPatient.modality}</strong>
              </div>
            </div>

            {/* Evolution Submitted by the Student */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F3A52] uppercase tracking-wide">
                Relato da Sessão Submetido pelo Estudante:
              </label>
              <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] text-xs text-[#1F3A52] leading-relaxed font-sans">
                {selectedPatient.id === "PAC-101"
                  ? "Paciente compareceu pontualmente à 7ª sessão. Relata redução nas crises de pânico após prática diária da técnica respiratória 4-7-8. Trabalhamos a identificação de pensamentos automáticos ligados à apresentação do TCC na faculdade, aplicando o RPD."
                  : selectedPatient.id === "PAC-103"
                  ? "Paciente compareceu no horário. Relatou melhora nos episódios de taquicardia através da respiração diafragmática ensinada na sessão anterior. Identificou pensamentos automáticos disfuncionais em provas ('Se eu não tirar dez, serei expulsa'). Aplicado RPD e psicoeducação sobre distorções cognitivas."
                  : "Sessão inicial de anamnese e estabelecimento do contrato terapêutico. Paciente relata isolamento social progressivo e dificuldade de concentração nos estudos. Aplicada escala preliminar de rastreio de sintomas depressivos com consentimento prévio."}
              </div>
            </div>

            {/* Supervisor's Feedback Area */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F3A52] uppercase tracking-wide">
                Devolutiva Pedagógica & Orientações de Supervisão:
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Insira as observações didáticas e orientações metodológicas para o estudante..."
                className="w-full text-xs p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4A6984] resize-none leading-relaxed"
              />
            </div>

            {/* Action Buttons: Sign/Homologate vs Request Revisions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#F4F0EA]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRequestRevision}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#EBE5DA] hover:bg-[#F4F0EA] text-[#7A6F62] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Solicitar Revisão ao Aluno
                </button>

                <button
                  onClick={handleApprove}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Homologar Visto Docente</span>
                </button>
              </div>
            </div>

            {approvalStatus === "approved" && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Prontuário homologado com sucesso e assinado digitalmente com {currentProfessor.crp}. 1 hora de estágio computada para o aluno.
                </span>
              </div>
            )}

            {approvalStatus === "revision" && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Solicitação de ajustes enviada para o estagiário {selectedPatient.allocatedStudent}.
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
