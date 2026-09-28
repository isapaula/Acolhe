import React, { useState } from "react";
import { UserRole, CurrentView } from "../types";
import { PsiLogo } from "./PsiLogo";
import { 
  HeartHandshake, 
  GraduationCap, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight,
  Shield
} from "lucide-react";

interface RegisterPageProps {
  onRegisterSuccess: (role: UserRole) => void;
  onNavigate: (view: CurrentView) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigate,
}) => {
  const [role, setRole] = useState<UserRole>("paciente");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // Specific fields
  const [semester, setSemester] = useState("9º Semestre");
  const [ra, setRa] = useState("");
  const [approach, setApproach] = useState("TCC");
  const [crp, setCrp] = useState("");
  const [title, setTitle] = useState("Mestrado");
  const [complaint, setComplaint] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(role);
    }, 700);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center watercolor-wash-hero relative">
      {/* Return to Home button */}
      <div className="w-full max-w-lg mb-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 text-xs font-semibold text-[#5a7a8a] hover:text-[#1F3A52] transition-colors cursor-pointer bg-white/70 px-3 py-1.5 rounded-full border border-[#EBE5DA]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Início</span>
        </button>

        <button
          onClick={() => onNavigate("login")}
          className="text-xs font-semibold text-[#4a8b7f] hover:underline cursor-pointer"
        >
          Já possui conta? Entrar
        </button>
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-[#EBE5DA] shadow-xl space-y-6 relative">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <PsiLogo size="md" variant="measured" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3A52]">
            Cadastro na Clínica-Escola
          </h2>
          <p className="text-xs text-[#7A6F62]">
            Selecione a modalidade de cadastro de acordo com seu papel
          </p>
        </div>

        {/* Role Picker */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#F4F0EA] rounded-2xl border border-[#EBE5DA]">
          <button
            type="button"
            onClick={() => setRole("paciente")}
            className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              role === "paciente"
                ? "bg-white text-[#4a8b7f] shadow-xs border border-[#EBE5DA]"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Paciente</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("aluno")}
            className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              role === "aluno"
                ? "bg-white text-[#4A6984] shadow-xs border border-[#EBE5DA]"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Aluno</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("professor")}
            className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              role === "professor"
                ? "bg-white text-[#7A6F62] shadow-xs border border-[#EBE5DA]"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Professor</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                E-mail {role !== "paciente" ? "Institucional" : ""} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                Telefone / Celular *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(61) 99999-9999"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          {role === "paciente" && (
            <div>
              <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                Breve motivo da procura por psicoterapia
              </label>
              <textarea
                rows={2}
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Ex.: Ansiedade, estresse acadêmico, dificuldades relacionais..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f] resize-none"
              />
            </div>
          )}

          {role === "aluno" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  RA do Aluno *
                </label>
                <input
                  type="text"
                  required
                  value={ra}
                  onChange={(e) => setRa(e.target.value)}
                  placeholder="RA-20228491"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  Semestre
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                >
                  <option value="8º Semestre">8º Semestre</option>
                  <option value="9º Semestre">9º Semestre</option>
                  <option value="10º Semestre">10º Semestre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  Abordagem
                </label>
                <select
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                >
                  <option value="TCC">TCC</option>
                  <option value="Psicanálise">Psicanálise</option>
                  <option value="Humanista">Humanista / Fenom.</option>
                </select>
              </div>
            </div>
          )}

          {role === "professor" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  Registro CRP Ativo *
                </label>
                <input
                  type="text"
                  required
                  value={crp}
                  onChange={(e) => setCrp(e.target.value)}
                  placeholder="CRP 04/23968"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
                  Titulação Acadêmica
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
                >
                  <option value="Especialista">Especialista</option>
                  <option value="Mestrado">Mestre</option>
                  <option value="Doutorado">Doutor(a)</option>
                  <option value="Pós-Doutorado">Pós-Doutor(a)</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1F3A52] mb-1">
              Criar Senha de Acesso *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] focus:outline-none focus:border-[#4a8b7f]"
            />
          </div>

          {/* Terms */}
          <div className="p-3 rounded-2xl bg-[#F4F0EA] border border-[#EBE5DA] flex items-start gap-2.5 text-[11px] text-[#7A6F62]">
            <Shield className="w-4 h-4 text-[#4a8b7f] shrink-0 mt-0.5" />
            <label className="cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mr-2 rounded border-[#EBE5DA] text-[#4a8b7f] focus:ring-[#4a8b7f]"
              />
              Declaro estar ciente de que as atividades clínicas desta plataforma seguem estritamente as diretrizes éticas do Conselho Federal de Psicologia (CFP) e da clínica-escola universitária.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !termsAgreed}
            className="w-full py-3 rounded-xl bg-[#4a8b7f] disabled:opacity-50 hover:bg-[#3d756b] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span>Finalizando cadastro...</span>
            ) : (
              <>
                <span>Concluir Cadastro e Acessar Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
