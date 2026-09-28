import { ServiceItem, UniversityStep, PatientRecord, ClinicalEvolution, StudentProfile, ProfessorProfile } from "../types";

export const servicesData: ServiceItem[] = [
  {
    id: "atendimento-individual",
    title: "Atendimento Psicológico Individual",
    subtitle: "Acolhimento empático focado na singularidade de cada pessoa",
    description: "Sessões semanais gratuitas ou a valor social para crianças, adolescentes, adultos e idosos da comunidade universitária e externa.",
    targetAudience: "Comunidade em geral, alunos universitários e colaboradores",
    format: "Híbrido",
    iconName: "HeartHandshake",
    scheduleInfo: "Sessões de 50 minutos semanais",
    details: [
      "Abordagens fundamentadas: TCC, Psicanálise e Humanismo/Fenomenologia",
      "Espaço seguro, sigiloso e livre de julgamentos",
      "Conduzido por acadêmicos do 8º ao 10º semestre com supervisão docente contínua",
      "Opção de consultas presenciais na Clínica-Escola ou online via sala protegida"
    ]
  },
  {
    id: "grupos-terapeuticos",
    title: "Grupos Terapêuticos e Psicoeducativos",
    subtitle: "A força do compartilhamento coletivo de vivências",
    description: "Espaços grupais focados em temas vitais: ansiedade acadêmica, parentalidade consciente, saúde mental da mulher e luto.",
    targetAudience: "Pais, estudantes sob pressão de TCC/provas, mães universitárias",
    format: "Presencial",
    iconName: "Users",
    scheduleInfo: "Encontros quinzenais de 90 minutos",
    details: [
      "Grupo de Manejo da Ansiedade e Estresse Universitário",
      "Grupo Terapêutico sobre Parentalidade e Relações Familiares",
      "Círculo de Acolhimento e Psicoeducação Nutricional e Emocional",
      "Troca orientada com mediação de estagiários e docentes"
    ]
  },
  {
    id: "cursos-capacitacao",
    title: "Cursos e Extensão Universitária",
    subtitle: "Formação continuada em saúde mental ética e atualizada",
    description: "Cursos abertos e de extensão ministrados por professores doutores e psicólogos convidados para atualização técnico-científica.",
    targetAudience: "Psicólogos(as), estudantes de graduação e profissionais de saúde e educação",
    format: "Online",
    iconName: "GraduationCap",
    scheduleInfo: "Aulas síncronas gravadas e materiais complementares",
    details: [
      "Introdução à Psicanálise Clínica Contemporânea",
      "Neurociência aplicada à Aprendizagem e Educação",
      "Elaboração de Documentos Psicológicos segundo Resolução do CFP",
      "Certificado emitido com chancela universitária oficial"
    ]
  },
  {
    id: "supervisao-clinica",
    title: "Supervisão Clínica para Estagiários",
    subtitle: "Rigor científico e suporte ético aos futuros profissionais",
    description: "Acompanhamento detalhado de casos clínicos reais com professores orientadores mestres e doutores com mais de 15 anos de prática.",
    targetAudience: "Estudantes em estágio curricular obrigatório e recém-formados",
    format: "Híbrido",
    iconName: "FileCheck",
    scheduleInfo: "Reuniões semanais de 2 horas por abordagem",
    details: [
      "Discussão aprofundada de hipóteses diagnósticas e manejo de vínculo",
      "Revisão e homologação de prontuários e laudos psicológicos",
      "Supervisão específica em Terapia Cognitivo-Comportamental (TCC)",
      "Supervisão em Psicanálise e Clínica Ampliada"
    ]
  },
  {
    id: "plantao-psicologico",
    title: "Plantão Psicológico e Triagem Acolhedora",
    subtitle: "Escuta imediata no momento de urgência subjetiva",
    description: "Serviço de portas abertas sem necessidade de agendamento prévio para acolher momentos de crise, sofrimento agudo ou desorientação.",
    targetAudience: "Qualquer pessoa que necessite de suporte pontual imediato",
    format: "Presencial",
    iconName: "Sparkles",
    scheduleInfo: "Segunda a Sexta, das 09h às 18h",
    details: [
      "Atendimento por ordem de chegada na clínica-escola",
      "Foco na classificação da demanda e alívio do sofrimento agudo",
      "Encaminhamento prioritário para psicoterapia contínua",
      "Conexão com a rede de atenção psicossocial (RAPS)"
    ]
  }
];

export const universityFlowSteps: UniversityStep[] = [
  {
    step: 1,
    title: "Inscrição & Triagem Comunitária",
    summary: "O paciente faz seu cadastro online ou presencial informando sua demanda com total acolhimento e respeito.",
    patientView: "Você preenche um formulário simples e humanizado. Nossa equipe de acolhimento entra em contato para uma conversa inicial de triagem.",
    studentView: "O estagiário recebe fichas de triagem para leitura de queixa preliminar e verificação de critérios de elegibilidade da clínica-escola.",
    teacherView: "O professor coordenador avalia a complexidade clínica de cada caso na fila de espera e dimensiona as vagas das turmas.",
    iconName: "UserPlus",
    timeframe: "1 a 3 dias úteis"
  },
  {
    step: 2,
    title: "Alocação do Aluno-Terapeuta",
    summary: "Cada paciente é cuidadosamente direcionado a um estudante do 8º ao 10º semestre conforme a abordagem terapêutica indicada.",
    patientView: "Você é apresentado(a) ao seu terapeuta estagiário, que cuidará do seu processo com dedicação e pontualidade.",
    studentView: "Você assume o caso, estuda a queixa principal e prepara o enquadre da primeira sessão com base na abordagem teórica.",
    teacherView: "Distribuição equitativa de casos respeitando o limite pedagógico de pacientes por acadêmico (máx. 3 a 4 casos).",
    iconName: "GitMerge",
    timeframe: "Semanal"
  },
  {
    step: 3,
    title: "Supervisão Clínica Docente",
    summary: "Nenhum atendimento ocorre sem debate prévio: professores mestres e doutores orientam cada passo do processo terapêutico.",
    patientView: "Você tem a segurança de que todo o seu tratamento é respaldado pelo olhar experiente de professores com doutorado.",
    studentView: "Você apresenta o caso semanalmente ao supervisor, refina hipóteses, discute contratransferência e técnicas clínicas.",
    teacherView: "Orientação individualizada e em grupo, direcionamento teórico e verificação do cumprimento das normas éticas do CFP.",
    iconName: "BookOpenCheck",
    timeframe: "Toda terça e quinta-feira"
  },
  {
    step: 4,
    title: "Sessões Contínuas de Terapia",
    summary: "Encontros semanais de 50 minutos, presenciais nas salas acusticamente isoladas da universidade ou online via sala protegida.",
    patientView: "Espaço contínuo de escuta, autoconhecimento e desenvolvimento emocional com total privacidade e acolhimento.",
    studentView: "Prática clínica real, desenvolvimento de escuta ativa, vínculo terapêutico e aplicação ética das intervenções.",
    teacherView: "Monitoramento de assiduidade, qualidade do vínculo e acompanhamento de gravações ou relatórios de sessão autorizados.",
    iconName: "CalendarClock",
    timeframe: "Sessões semanais regulares"
  },
  {
    step: 5,
    title: "Prontuário Digital & Homologação",
    summary: "Registro sigiloso da evolução em sistema criptografado com assinatura digital do supervisor e contabilização de horas.",
    patientView: "Seus dados de saúde mental são guardados sob rigoroso sigilo profissional, conforme a Lei Geral de Proteção de Dados (LGPD).",
    studentView: "Preenchimento da evolução após cada sessão, solicitação de visto do professor e cômputo das horas de estágio curricular.",
    teacherView: "Leitura minuciosa da evolução, inserção de apontamentos pedagógicos e assinatura digital do termo de estágio.",
    iconName: "ShieldCheck",
    timeframe: "Imediato após cada sessão"
  }
];

export const mockPatients: PatientRecord[] = [
  {
    id: "PAC-101",
    patientName: "Mariana Albuquerque Silva",
    age: 26,
    phone: "(61) 98765-4321",
    email: "mariana.albuquerque@email.com",
    mainComplaint: "Ansiedade generalizada associada à transição de carreira e insônia frequente há 6 meses.",
    allocatedStudent: "Felipe Souza Mendes",
    supervisor: "Profa. Dra. Tatiana Corrêa Linhares",
    clinicalApproach: "Terapia Cognitivo-Comportamental (TCC)",
    status: "em_atendimento",
    nextSessionDate: "2026-09-18",
    nextSessionTime: "14:00",
    modality: "Teleconsulta (Sala Segura)",
    lastEvolutionDate: "2026-09-11",
    supervisorSigned: true
  },
  {
    id: "PAC-102",
    patientName: "Lucas Henrique Ferreira",
    age: 34,
    phone: "(61) 99123-8877",
    email: "lucas.ferreira@email.com",
    mainComplaint: "Dificuldades de relacionamento interpessoal no ambiente acadêmico e sentimentos de inadequação.",
    allocatedStudent: "Paula Santos Barbosa",
    supervisor: "Prof. Dr. Eder Luiz Nogueira",
    clinicalApproach: "Psicanálise e Clínica Ampliada",
    status: "em_atendimento",
    nextSessionDate: "2026-09-19",
    nextSessionTime: "10:30",
    modality: "Presencial (Sala 04)",
    lastEvolutionDate: "2026-09-12",
    supervisorSigned: true
  },
  {
    id: "PAC-103",
    patientName: "Clara Beatriz de Souza",
    age: 19,
    phone: "(61) 98455-1122",
    email: "clara.souza@universidade.edu.br",
    mainComplaint: "Adaptação ao primeiro ano universitário, crise de pânico pré-avaliações e pressão familiar.",
    allocatedStudent: "Felipe Souza Mendes",
    supervisor: "Profa. Dra. Tatiana Corrêa Linhares",
    clinicalApproach: "Terapia Cognitivo-Comportamental (TCC)",
    status: "em_atendimento",
    nextSessionDate: "2026-09-22",
    nextSessionTime: "16:00",
    modality: "Presencial (Sala 02)",
    lastEvolutionDate: "2026-09-15",
    supervisorSigned: false
  },
  {
    id: "PAC-104",
    patientName: "João Roberto Silveira",
    age: 48,
    phone: "(61) 97788-3344",
    email: "joao.silveira@email.com",
    mainComplaint: "Processo de luto recente e sintomatologia depressiva leve.",
    allocatedStudent: "Aguardando alocação",
    supervisor: "Profa. Ma. Liliane Cristina Santos",
    clinicalApproach: "Humanista / Fenomenológica",
    status: "triagem",
    nextSessionDate: "2026-09-25",
    nextSessionTime: "09:00",
    modality: "Presencial (Sala 01)",
    supervisorSigned: false
  }
];

export const mockEvolutions: ClinicalEvolution[] = [
  {
    id: "EVO-501",
    patientId: "PAC-103",
    patientName: "Clara Beatriz de Souza",
    studentName: "Felipe Souza Mendes",
    sessionNumber: 3,
    date: "2026-09-15",
    approach: "TCC",
    sessionSummary: "Paciente compareceu no horário. Relatou melhora nos episódios de taquicardia através da respiração diafragmática ensinada na sessão anterior. Identificou pensamentos automáticos disfuncionais em provas ('Se eu não tirar dez, serei expulsa').",
    therapeuticInterventions: "Registro de Pensamentos Disfuncionais (RPD), psicoeducação sobre distorções cognitivas (catastrofização) e reestruturação com evidências reais.",
    nextStepPlan: "Aprofundar o exame de evidências na próxima sessão e treinar técnicas de relaxamento muscular progressivo.",
    status: "enviado_para_supervisao",
    supervisorFeedback: "Excelente identificação dos pensamentos automáticos, Felipe. Lembre-se de explorar a crença nuclear subjacente na supervisão de quinta-feira.",
  },
  {
    id: "EVO-502",
    patientId: "PAC-101",
    patientName: "Mariana Albuquerque Silva",
    studentName: "Felipe Souza Mendes",
    sessionNumber: 6,
    date: "2026-09-11",
    approach: "TCC",
    sessionSummary: "Paciente demonstrou estabilidade de humor. Apresentou o plano de ação construído para transição de carreira. Sono regularizado de 4 para 6 horas e meia diárias.",
    therapeuticInterventions: "Reforço de conquistas, validação emocional, planejamento de metas SMART para entrevistas profissionais.",
    nextStepPlan: "Manter acompanhamento semanal e introduzir inventário de assertividade.",
    status: "homologado",
    supervisorFeedback: "Caso com evolução clínica muito favorável. Homologado e horas validadas.",
    signedAt: "2026-09-12 11:20"
  }
];

export const currentStudent: StudentProfile = {
  id: "ALU-2024",
  name: "Felipe Souza Mendes",
  semester: "9º Semestre",
  academicId: "RA-20228491",
  approach: "Terapia Cognitivo-Comportamental (TCC)",
  supervisorName: "Profa. Dra. Tatiana Corrêa Linhares (CRP 04/23968)",
  completedHours: 320,
  requiredHours: 400,
  activePatients: 3,
  supervisedSessionsCount: 28
};

export const currentProfessor: ProfessorProfile = {
  id: "DOC-1002",
  name: "Profa. Dra. Tatiana Corrêa Linhares",
  crp: "CRP 04/23968",
  title: "Doutora e Mestre em Psicologia (UFMG)",
  specialty: "TCC e Avaliação Neuropsicológica",
  department: "Departamento de Psicologia Clínica e da Saúde",
  supervisedStudentsCount: 14,
  activeCasesCount: 42,
  pendingReviewsCount: 3
};
