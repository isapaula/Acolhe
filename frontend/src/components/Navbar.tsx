import React, { useState } from "react";
import { CurrentView, UserRole } from "../types";
import { PsiLogo } from "./PsiLogo";
import { Menu, X, LogIn, Stethoscope } from "lucide-react";

interface NavbarProps {
  currentView: CurrentView;
  onNavigate?: (view: CurrentView, role?: UserRole) => void;
  setCurrentView?: (view: CurrentView) => void;
  currentUserRole?: UserRole | null;
  setCurrentUserRole?: (role: UserRole | null) => void;
  onOpenTriage?: () => void;
  onOpenQuickTriage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  setCurrentView,
  currentUserRole,
  setCurrentUserRole,
  onOpenTriage,
  onOpenQuickTriage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenModal = () => {
    if (onOpenTriage) {
      onOpenTriage();
    } else if (onOpenQuickTriage) {
      onOpenQuickTriage();
    }
  };

  const navigateTo = (view: CurrentView, role?: UserRole) => {
    if (role && setCurrentUserRole) {
      setCurrentUserRole(role);
    }
    if (onNavigate) {
      onNavigate(view, role);
    } else if (setCurrentView) {
      setCurrentView(view);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);

    const performScroll = () => {
      if (id === "hero" || id === "inicio") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        return;
      }

      const el = document.getElementById(id);
      if (el) {
        // Scroll directly to the section's title (h2) for perfect visual framing below the sticky navbar
        const titleEl = el.querySelector("h2") || el;
        const navOffset = 76; // Sticky navbar height + spacing
        const rect = titleEl.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - navOffset;

        window.scrollTo({
          top: Math.max(0, targetY),
          left: 0,
          behavior: "smooth",
        });
      }
    };

    if (currentView !== "landing") {
      if (onNavigate) {
        onNavigate("landing");
      } else if (setCurrentView) {
        setCurrentView("landing");
      }
      setTimeout(performScroll, 120);
    } else {
      // Delay slightly so mobile drawer collapse doesn't interrupt smooth scroll
      setTimeout(performScroll, 80);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#EBE5DA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <button
            onClick={() => navigateTo("landing")}
            className="flex items-center gap-3.5 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a8b7f] rounded-xl p-1"
            aria-label="Acolhe - Página Inicial"
          >
            <PsiLogo size="md" variant="measured" />
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#1F3A52] group-hover:text-[#4A6984] transition-colors">
                Acolhe<span className="text-[#4a8b7f]">.</span>
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-[#7A6F62] tracking-wide -mt-1 flex items-center gap-1">
                <span>Clínica-Escola Universitária</span>
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#1F3A52]" aria-label="Navegação Principal">
            <button
              onClick={() => scrollToSection("hero")}
              className="hover:text-[#4a8b7f] transition-colors cursor-pointer py-1"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="hover:text-[#4a8b7f] transition-colors cursor-pointer py-1"
            >
              Serviços & Terapias
            </button>
            <button
              onClick={() => scrollToSection("porque-fazemos")}
              className="hover:text-[#4a8b7f] transition-colors cursor-pointer py-1"
            >
              Por Que Fazemos
            </button>
            <button
              onClick={() => scrollToSection("unidades-rodape")}
              className="hover:text-[#4a8b7f] transition-colors cursor-pointer py-1"
            >
              Unidades & Contato
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Login CTA */}
            {currentView !== "login" && currentView !== "cadastro" ? (
              <button
                onClick={() => navigateTo("login")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#1F3A52] hover:text-[#4a8b7f] hover:bg-[#EBE5DA]/50 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            ) : null}

            {/* Primary Action */}
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#4a8b7f] hover:bg-[#3d756b] text-white shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Agendar Acolhimento</span>
            </button>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => navigateTo("login")}
              className="p-2 text-[#1F3A52] hover:text-[#4a8b7f]"
              aria-label="Fazer login"
            >
              <LogIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1F3A52] hover:bg-[#EBE5DA] focus:outline-none"
              aria-label="Abrir menu de navegação"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F9F6F0] border-b border-[#EBE5DA] px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 gap-2 pt-2">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#1F3A52] hover:bg-[#EBE5DA]"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#1F3A52] hover:bg-[#EBE5DA]"
            >
              Serviços & Terapias
            </button>
            <button
              onClick={() => scrollToSection("porque-fazemos")}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#1F3A52] hover:bg-[#EBE5DA]"
            >
              Por Que Fazemos
            </button>
            <button
              onClick={() => scrollToSection("unidades-rodape")}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#1F3A52] hover:bg-[#EBE5DA]"
            >
              Unidades & Contato
            </button>
          </div>

          <div className="pt-3 border-t border-[#EBE5DA] space-y-2">
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => navigateTo("login")}
                className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl bg-[#EBE5DA] text-[#1F3A52]"
              >
                Fazer Login
              </button>
              <button
                onClick={() => navigateTo("cadastro")}
                className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl bg-[#4a8b7f] text-white"
              >
                Cadastrar-se
              </button>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenModal();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-[#1F3A52] text-white flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Agendar Acolhimento</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
