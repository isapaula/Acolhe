import React, { useState } from "react";
import { PsiLogo } from "./PsiLogo";
import { mockPatients, mockEvolutions, currentStudent } from "../data/initialData";
import { PatientRecord, ClinicalEvolution } from "../types";
import { 
  Users, 
  Clock, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  AlertCircle, 
  LogOut, 
  Calendar, 
  Search 
} from "lucide-react";

interface StudentPortalProps {
  onLogout: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onLogout,
}) => {
  const [patients, setPatients] = useState<PatientRecord[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(mockPatients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Prontuário Form State
  const [sessionNotes, setSessionNotes] = useState(
    "Paciente compareceu pontualmente à sessão. Relata redução nas crises de pânico após prática diária da técnica respiratória. Trabalhamos a identificação de pensamentos automáticos ligados à apresentação do TCC na faculdade."
  );
  const [sessionTechnique, setSessionTechnique] = useState("Registro de Pensamentos Disfuncionais (RPD) e Reestruturação Cognitiva");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredPatients = patients.filter((p) =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendToSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1F3A52] pb-16">
      {/* Header */}
      <header className="bg-white border-b border-[#EBE5DA] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PsiLogo size="sm" variant="measured" />
          <div>
            <div className="font-serif text-lg font-bold text-[#1F3A52]">
              Portal do Aluno Estagiário
            </div>
            <div className="text-[11px] text-[#5a7a8a]">
              {currentStudent.name} • {currentStudent.academicId} • {currentStudent.semester} ({currentStudent.approach})
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
        {/* KPI Row: Estágio Hours & Supervision Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Horas Clínicas Acumuladas</span>
              <Clock className="w-4 h-4 text-[#4a8b7f]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#1F3A52]">
              {currentStudent.completedHours}h{" "}
              <span className="text-xs font-normal text-[#7A6F62]">/ {currentStudent.requiredHours}h</span>
            </div>
            <div className="w-full bg-[#F4F0EA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4a8b7f] h-full rounded-full"
                style={{ width: `${(currentStudent.completedHours / currentStudent.requiredHours) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-[#5a7a8a]">
              {Math.round((currentStudent.completedHours / currentStudent.requiredHours) * 100)}% do estágio obrigatório concluído
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Pacientes em Acompanhamento</span>
              <Users className="w-4 h-4 text-[#4A6984]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#1F3A52]">
              {currentStudent.activePatients} Ativos
            </div>
            <div className="text-[10px] text-[#5a7a8a]">Todos com termo de consentimento assinado</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Próxima Supervisão Docente</span>
              <Calendar className="w-4 h-4 text-[#967B62]" />
            </div>
            <div className="font-serif text-sm font-bold text-[#1F3A52]">
              Quinta-feira, 10:00
            </div>
            <div className="text-[10px] text-[#5a7a8a]">Com {currentStudent.supervisorName}</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A6F62]">
              <span>Prontuários Pendentes</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-amber-700">
              1 aguardando
            </div>
            <div className="text-[10px] text-[#7A6F62]">Evolução da sessão de ontem</div>
          </div>
        </div>

        {/* Main Content Area: Patient Caseload + Clinical Notes Writer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patients Column (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#EBE5DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F0EA] pb-3">
              <h3 className="font-serif text-base font-bold text-[#1F3A52] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4a8b7f]" />
                <span>Seus Pacientes Alocados</span>
              </h3>
              <span className="text-[11px] text-[#7A6F62] bg-[#F9F6F0] px-2 py-0.5 rounded-full">
                {patients.length} casos
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
              />
              <Search className="w-3.5 h-3.5 text-[#7A6F62] absolute left-2.5 top-2.5" />
            </div>

            {/* Patient Cards */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto">
              {filteredPatients.map((patient) => {
                const isSelected = selectedPatient.id === patient.id;
                return (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#4a8b7f]/10 border-[#4a8b7f] shadow-xs"
                        : "bg-white hover:bg-[#F9F6F0] border-[#EBE5DA]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#1F3A52]">{patient.patientName}</div>
                      <span className="text-[10px] text-[#5a7a8a] bg-[#F4F0EA] px-2 py-0.5 rounded-full">
                        {patient.modality}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#7A6F62] mt-1 line-clamp-1">
                      Queixa: {patient.mainComplaint}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-[#5a7a8a]">
                        Sessão: {patient.nextSessionDate} ({patient.nextSessionTime})
                      </span>
                      <span
                        className={`font-semibold ${
                          patient.supervisorSigned
                            ? "text-emerald-700"
                            : "text-amber-700"
                        }`}
                      >
                        {patient.supervisorSigned ? "Homologado" : "Aguardando Visto"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prontuário & Supervisão Workspace (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DA] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4F0EA] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a8b7f]">
                  Prontuário Digital Ético (Resolução CFP nº 001/2009)
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F3A52]">
                  Evolução Clínica: {selectedPatient.patientName}
                </h3>
              </div>
            </div>

            {/* Case Quick Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F9F6F0] border border-[#EBE5DA] text-xs">
              <div>
                <span className="text-[#7A6F62] block text-[11px]">Idade & Contato:</span>
                <strong className="text-[#1F3A52]">{selectedPatient.age} anos • {selectedPatient.phone}</strong>
              </div>
              <div>
                <span className="text-[#7A6F62] block text-[11px]">Demanda Clínica:</span>
                <strong className="text-[#1F3A52]">{selectedPatient.mainComplaint}</strong>
              </div>
              <div>
                <span className="text-[#7A6F62] block text-[11px]">Supervisor Docente:</span>
                <strong className="text-[#1F3A52]">{selectedPatient.supervisor}</strong>
              </div>
            </div>

            {/* Supervisor's Feedback on Last Session */}
            {mockEvolutions[0]?.supervisorFeedback && (
              <div className="p-4 rounded-2xl bg-[#A3B8CC]/20 border border-[#A3B8CC]/50 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#1F3A52]">
                  <GraduationCap className="w-4 h-4 text-[#4A6984]" />
                  <span>Devolutiva Docente (Profa. Tatiana Corrêa Linhares):</span>
                </div>
                <p className="text-[#1F3A52] italic leading-relaxed">
                  "{mockEvolutions[0].supervisorFeedback}"
                </p>
              </div>
            )}

            {/* Evolution Form */}
            <form onSubmit={handleSendToSupervisor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  Técnicas / Abordagem Aplicada nesta Sessão:
                </label>
                <input
                  type="text"
                  required
                  value={sessionTechnique}
                  onChange={(e) => setSessionTechnique(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  Registro da Sessão (Relato Fenomenológico / Evolução Técnica):
                </label>
                <textarea
                  rows={5}
                  required
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f] resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F4F0EA] border border-[#EBE5DA] text-[11px] text-[#7A6F62] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4a8b7f] shrink-0" />
                <span>
                  Ao enviar, esta anotação clínica entrará na fila de revisão da Profa. Tatiana Linhares para
                  validação e homologação de horas de estágio.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-[#7A6F62]">
                  Última edição salva localmente às 15:42
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Prontuário para Supervisão</span>
                </button>
              </div>

              {formSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Prontuário enviado com sucesso para a Profa. Dra. Tatiana Linhares! Status alterado para "Aguardando Visto".
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
