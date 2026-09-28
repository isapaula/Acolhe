import React, { useState } from "react";
import { UserRole, CurrentView } from "../types";
import { PsiLogo } from "./PsiLogo";
import { 
  HeartHandshake, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigate: (view: CurrentView) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("paciente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedRole);
    }, 600);
  };

  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);
    if (role === "paciente") {
      setEmail("mariana.albuquerque@email.com");
    } else if (role === "aluno") {
      setEmail("felipe.souza@universidade.edu.br");
    } else {
      setEmail("tatiana.linhares@universidade.edu.br");
    }
    setPassword("••••••••");
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(role);
    }, 400);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center watercolor-wash-hero relative">
      {/* Return to Home button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 text-xs font-semibold text-[#5a7a8a] hover:text-[#1F3A52] transition-colors cursor-pointer bg-white/70 px-3 py-1.5 rounded-full border border-[#EBE5DA]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Página Inicial</span>
        </button>

        <span className="text-[11px] text-[#7A6F62] bg-[#EBE5DA] px-2.5 py-1 rounded-full">
          Ambiente Seguro
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#EBE5DA] shadow-xl space-y-7 relative">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <PsiLogo size="md" variant="measured" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3A52]">
            Acesso ao Sistema
          </h2>
          <p className="text-xs text-[#7A6F62]">
            Selecione seu perfil na clínica-escola para acessar sua área
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#F4F0EA] rounded-2xl border border-[#EBE5DA]">
          <button
            type="button"
            onClick={() => setSelectedRole("paciente")}
            className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === "paciente"
                ? "bg-white text-[#4a8b7f] shadow-xs border border-[#EBE5DA]"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Paciente</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("aluno")}
            className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === "aluno"
                ? "bg-white text-[#4A6984] shadow-xs border border-[#EBE5DA]"
                : "text-[#7A6F62] hover:text-[#1F3A52]"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Aluno</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("professor")}
            className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === "professor"
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
          <div>
            <label className="block text-xs font-semibold text-[#1F3A52] mb-1.5">
              {selectedRole === "paciente"
                ? "E-mail ou CPF cadastrado"
                : selectedRole === "aluno"
                ? "E-mail institucional ou RA do Aluno"
                : "E-mail institucional ou CRP do Docente"}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === "paciente"
                    ? "exemplo@email.com"
                    : selectedRole === "aluno"
                    ? "aluno@universidade.edu.br"
                    : "professor@universidade.edu.br"
                }
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] placeholder-[#7A6F62] focus:outline-none focus:border-[#4a8b7f]"
              />
              <Mail className="w-4 h-4 text-[#7A6F62] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#1F3A52]">
                Senha
              </label>
              <button
                type="button"
                onClick={() => alert("Instruções de recuperação foram enviadas para seu e-mail cadastrado.")}
                className="text-[11px] text-[#5a7a8a] hover:underline cursor-pointer"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] placeholder-[#7A6F62] focus:outline-none focus:border-[#4a8b7f]"
              />
              <Lock className="w-4 h-4 text-[#7A6F62] absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#7A6F62] hover:text-[#1F3A52]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Fast Demo Logins */}
        <div className="pt-2 border-t border-[#F4F0EA] space-y-2">
          <div className="text-center text-[11px] font-semibold text-[#7A6F62] uppercase tracking-wider">
            Ou teste direto com 1 clique (Modo Demonstração):
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("paciente")}
              className="py-1.5 px-2 rounded-lg bg-[#A3B8CC]/25 hover:bg-[#A3B8CC]/40 text-[#1F3A52] text-[11px] font-medium transition-colors cursor-pointer"
            >
              Demo Paciente
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("aluno")}
              className="py-1.5 px-2 rounded-lg bg-[#9CAF88]/25 hover:bg-[#9CAF88]/40 text-[#1F3A52] text-[11px] font-medium transition-colors cursor-pointer"
            >
              Demo Aluno
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("professor")}
              className="py-1.5 px-2 rounded-lg bg-[#B89C85]/25 hover:bg-[#B89C85]/40 text-[#1F3A52] text-[11px] font-medium transition-colors cursor-pointer"
            >
              Demo Professor
            </button>
          </div>
        </div>

        {/* Link to Registration */}
        <div className="text-center pt-2">
          <span className="text-xs text-[#7A6F62]">
            Ainda não tem cadastro na clínica?{" "}
          </span>
          <button
            onClick={() => onNavigate("cadastro")}
            className="text-xs font-bold text-[#4a8b7f] hover:underline cursor-pointer"
          >
            Criar conta gratuita
          </button>
        </div>
      </div>
    </div>
  );
};
