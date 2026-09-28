import React, { useState } from "react";
import { PsiLogo } from "./PsiLogo";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface FooterSectionProps {
  onNavigate: (view: any) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onNavigate }) => {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setMessageSent(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 1500);
  };

  return (
    <footer id="unidades-rodape" className="bg-[#1F3A52] text-[#F9F6F0] relative overflow-hidden">
      {/* Top Banner: Emergency support info */}
      <div className="bg-[#4A6984]/40 border-b border-[#4A6984] py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#EBE5DA]">
            <AlertCircle className="w-4 h-4 text-[#B89C85] shrink-0" />
            <span>
              <strong>Em situação de urgência ou crise emocional aguda:</strong> Ligue para o <strong>CVV (188)</strong>, atendimento 24h gratuito e sigiloso, ou dirija-se a uma UPA/SAMU (192).
            </span>
          </div>
          <a
            href="tel:188"
            className="px-3 py-1 rounded-full bg-[#967B62] hover:bg-[#B89C85] text-white font-bold transition-colors shrink-0"
          >
            Ligar para 188
          </a>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Psychology Clinic Mission */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <PsiLogo size="md" variant="measured" />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Acolhe<span className="text-[#9CAF88]">.</span>
                </span>
                <div className="text-xs text-[#A3B8CC]">Clínica-Escola Universitária</div>
              </div>
            </div>

            <p className="text-xs text-[#EBE5DA] leading-relaxed max-w-sm">
              Espaço formativo e de assistência psicológica comunitária. Formando futuros psicólogos
              com rigor ético, acolhimento humanizado e compromisso social irrestrito com a saúde mental.
            </p>

            <div className="space-y-2 text-xs text-[#A3B8CC]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9CAF88]" />
                <span>Segunda a Sexta: 07h30 às 21h00 • Sábado: 08h00 às 13h00</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9CAF88]" />
                <span>Supervisão Docente Homologada • Registo CRP 04/J-2891</span>
              </div>
            </div>
          </div>

          {/* Unidades & Endereços (Inspirado no MeuSiteV1) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h3 className="font-serif text-lg font-bold text-white border-b border-[#4A6984] pb-2">
              Nossas Unidades de Atendimento
            </h3>

            {/* Unidade Plano Piloto (from MeuSiteV1) */}
            <div className="bg-[#4A6984]/30 rounded-2xl p-4 border border-[#4A6984]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9CAF88]" />
                  <span>Unidade Plano Piloto (Brasília)</span>
                </span>
                <span className="text-[10px] text-[#A3B8CC] bg-[#1F3A52] px-2 py-0.5 rounded">
                  Campus Asa Sul
                </span>
              </div>
              <div className="text-xs text-[#EBE5DA] space-y-1">
                <p>SEPS 707/907 - Asa Sul, Conjunto E, Bloco 02 - Brasília/DF</p>
                <div className="flex items-center gap-4 text-[11px] text-[#A3B8CC] pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> (61) 3234-6547
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> asasul@acolhe.edu.br
                  </span>
                </div>
              </div>
            </div>

            {/* Unidade São Paulo (from MeuSiteV1) */}
            <div className="bg-[#4A6984]/30 rounded-2xl p-4 border border-[#4A6984]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9CAF88]" />
                  <span>Unidade São Paulo (Campus Central)</span>
                </span>
                <span className="text-[10px] text-[#A3B8CC] bg-[#1F3A52] px-2 py-0.5 rounded">
                  Clínica Central
                </span>
              </div>
              <div className="text-xs text-[#EBE5DA] space-y-1">
                <p>Av. dos Contos, 025 - Consolação - São Paulo/SP</p>
                <div className="flex items-center gap-4 text-[11px] text-[#A3B8CC] pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> (11) 3698-8521
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> saopaulo@acolhe.edu.br
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form (from MeuSiteV1 'Fale Conosco') */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h3 className="font-serif text-lg font-bold text-white border-b border-[#4A6984] pb-2">
              Fale Conosco
            </h3>

            {messageSent ? (
              <div className="bg-[#4a8b7f]/20 border border-[#4a8b7f] rounded-2xl p-4 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-[#9CAF88] mx-auto" />
                <div className="text-xs font-bold text-white">Mensagem Enviada!</div>
                <p className="text-[11px] text-[#EBE5DA]">
                  Nossa secretaria acadêmica responderá em até 24 horas úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#4A6984]/40 border border-[#4A6984] text-white placeholder-[#A3B8CC] focus:outline-none focus:border-[#9CAF88]"
                />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#4A6984]/40 border border-[#4A6984] text-white placeholder-[#A3B8CC] focus:outline-none focus:border-[#9CAF88]"
                />
                <textarea
                  placeholder="Como podemos te acolher?"
                  rows={2}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#4A6984]/40 border border-[#4A6984] text-white placeholder-[#A3B8CC] focus:outline-none focus:border-[#9CAF88] resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#4a8b7f] hover:bg-[#3d756b] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Portals Quick Links Bar */}
        <div className="mt-12 pt-8 border-t border-[#4A6984] flex flex-wrap items-center justify-between gap-4 text-xs text-[#A3B8CC]">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate("landing")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => onNavigate("paciente")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Portal do Paciente
            </button>
            <button
              onClick={() => onNavigate("aluno")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Portal do Aluno Estagiário
            </button>
            <button
              onClick={() => onNavigate("professor")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Portal do Professor Supervisor
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Fazer Login
            </button>
            <button
              onClick={() => onNavigate("cadastro")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cadastre-se
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#EBE5DA]">
            <span>Desenvolvido com carinho para a saúde mental e formação universitária</span>
            <Heart className="w-3 h-3 text-[#B89C85] inline fill-current" />
          </div>
        </div>

        {/* Bottom copyright & Accessibility notice */}
        <div className="mt-6 pt-4 border-t border-[#4A6984]/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A3B8CC] gap-2">
          <div>
            © {new Date().getFullYear()} Acolhe. Todos os direitos reservados.
          </div>
          <div>
            Conforme Código de Ética Profissional do Psicólogo (CFP) e LGPD.
          </div>
        </div>
      </div>
    </footer>
  );
};
