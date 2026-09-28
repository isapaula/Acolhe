import React, { useState, useEffect } from "react";
import { CurrentView, UserRole } from "./types";
import { AccessibilityBar } from "./components/AccessibilityBar";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { WhyWeDoItSection } from "./components/WhyWeDoItSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { FooterSection } from "./components/FooterSection";
import { TriageModal } from "./components/TriageModal";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { PatientPortal } from "./components/PatientPortal";
import { StudentPortal } from "./components/StudentPortal";
import { TeacherPortal } from "./components/TeacherPortal";

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<CurrentView>("landing");

  // Accessibility States
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Modals State
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [triageDefaultService, setTriageDefaultService] = useState("Atendimento Psicológico Individual");

  // Authentication State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  // Keep accessibility classes in sync on document body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  const handleOpenTriage = (serviceName?: string) => {
    if (serviceName) {
      setTriageDefaultService(serviceName);
    }
    setIsTriageOpen(true);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setCurrentUserRole(role);
    if (role === "paciente") setCurrentView("paciente");
    else if (role === "aluno") setCurrentView("aluno");
    else if (role === "professor") setCurrentView("professor");
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
    setCurrentView("landing");
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        fontSize === "large" ? "text-lg" : fontSize === "larger" ? "text-xl" : "text-base"
      }`}
    >
      {/* Universal Accessibility Bar (topmost) */}
      <AccessibilityBar
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />

      {/* Conditional Screen Rendering */}
      {currentView === "landing" && (
        <>
          <Navbar
            currentView={currentView}
            onNavigate={(view, role) => {
              if (role) setCurrentUserRole(role);
              setCurrentView(view);
            }}
            setCurrentView={setCurrentView}
            currentUserRole={currentUserRole}
            setCurrentUserRole={setCurrentUserRole}
            onOpenTriage={() => handleOpenTriage()}
          />

          <main id="main-content" className="relative">
            {/* 1. Animated Full-Screen Hero Section (Sticky) */}
            <HeroSection
              reducedMotion={reducedMotion}
              onOpenTriage={() => handleOpenTriage()}
            />

            {/* As outras partes do site sobem por cima da Hero com efeito cortina suave */}
            <div className="relative z-10 bg-[#F9F6F0] shadow-[0_-25px_60px_rgba(31,58,82,0.12)] rounded-t-[32px] sm:rounded-t-[48px] border-t border-[#EBE5DA] overflow-hidden">
              {/* 2. Services Section (Tipos de terapia / o que oferecemos) */}
              <ServicesSection
                onSelectServiceForTriage={(serviceName) => handleOpenTriage(serviceName)}
              />

              {/* 3. Why We Do It Section (Porque fazemos isso / Propósito do Projeto) */}
              <WhyWeDoItSection />

              {/* 4. Como Funciona a Clínica-Escola (no lugar dos depoimentos, com animação automática de passos) */}
              <HowItWorksSection
                onOpenTriage={() => handleOpenTriage()}
                onNavigateToPortal={(role) => {
                  setCurrentUserRole(role);
                  setCurrentView(role);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                reducedMotion={reducedMotion}
              />

              {/* 5. Footer (Unidades de atendimento, contatos e ética) */}
              <FooterSection onNavigate={(view) => setCurrentView(view)} />
            </div>
          </main>
        </>
      )}

      {currentView === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === "cadastro" && (
        <RegisterPage
          onRegisterSuccess={handleLoginSuccess}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === "paciente" && (
        <PatientPortal
          onLogout={handleLogout}
        />
      )}

      {currentView === "aluno" && (
        <StudentPortal
          onLogout={handleLogout}
        />
      )}

      {currentView === "professor" && (
        <TeacherPortal
          onLogout={handleLogout}
        />
      )}

      {/* Triage & Inscription Modal */}
      <TriageModal
        isOpen={isTriageOpen}
        onClose={() => setIsTriageOpen(false)}
        defaultService={triageDefaultService}
        onSuccessNavigateToPatient={() => setCurrentView("paciente")}
      />
    </div>
  );
}
