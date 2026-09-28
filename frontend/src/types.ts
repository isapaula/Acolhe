export type UserRole = "paciente" | "aluno" | "professor";

export type CurrentView = "landing" | "login" | "cadastro" | "paciente" | "aluno" | "professor";

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetAudience: string;
  format: "Presencial" | "Online" | "Híbrido";
  iconName: string;
  details: string[];
  scheduleInfo: string;
}

export interface UniversityStep {
  step: number;
  title: string;
  summary: string;
  patientView: string;
  studentView: string;
  teacherView: string;
  iconName: string;
  timeframe: string;
}

export interface PatientRecord {
  id: string;
  patientName: string;
  age: number;
  phone: string;
  email: string;
  mainComplaint: string;
  allocatedStudent: string;
  supervisor: string;
  clinicalApproach: string;
  status: "triagem" | "em_atendimento" | "aguardando_vaga" | "concluido";
  nextSessionDate: string;
  nextSessionTime: string;
  modality: string;
  lastEvolutionDate?: string;
  supervisorSigned: boolean;
}

export interface ClinicalEvolution {
  id: string;
  patientId: string;
  patientName: string;
  studentName: string;
  sessionNumber: number;
  date: string;
  approach: string;
  sessionSummary: string;
  therapeuticInterventions: string;
  nextStepPlan: string;
  status: "rascunho" | "enviado_para_supervisao" | "aprovado_com_ressalvas" | "homologado";
  supervisorFeedback?: string;
  signedAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  semester: string;
  academicId: string; // RA
  approach: string;
  supervisorName: string;
  completedHours: number;
  requiredHours: number;
  activePatients: number;
  supervisedSessionsCount: number;
}

export interface ProfessorProfile {
  id: string;
  name: string;
  crp: string;
  title: string; // Mestre / Doutora
  specialty: string;
  department: string;
  supervisedStudentsCount: number;
  activeCasesCount: number;
  pendingReviewsCount: number;
}
