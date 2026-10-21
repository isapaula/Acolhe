
import React, { useEffect, useState } from "react";
import {
  X,
  CalendarPlus,
  CalendarDays,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { PsiLogo } from "./PsiLogo";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  solicitationId: number;
  onSuccess?: () => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  patientName,
  solicitationId,
  onSuccess,
}) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [countdownProgress, setCountdownProgress] = useState(100);

  // Obtém a data local no formato esperado pelo input date.
  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleClose = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setFormError("");
    setIsSubmitting(false);
    setSubmittedSuccess(false);
    setCountdownProgress(100);
    onClose();
  };

  // Fecha automaticamente após exibir a confirmação por 3 segundos.
  // Os temporizadores são cancelados se o modal fechar ou desmontar.
  useEffect(() => {
    if (!isOpen || !submittedSuccess) return;

    setCountdownProgress(100);

    const animationTimeout = window.setTimeout(() => {
      setCountdownProgress(0);
    }, 50);

    const closeTimeout = window.setTimeout(() => {
      setDate("");
      setStartTime("");
      setEndTime("");
      setFormError("");
      setIsSubmitting(false);
      setSubmittedSuccess(false);
      setCountdownProgress(100);
      onClose();
    }, 3050);

    return () => {
      window.clearTimeout(animationTimeout);
      window.clearTimeout(closeTimeout);
    };
  }, [isOpen, submittedSuccess, onClose]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFormError("");

    if (date < minDate) {
      setFormError("Selecione hoje ou uma data futura.");
      return;
    }

    if (endTime <= startTime) {
      setFormError(
        "O horário de término deve ser posterior ao início."
      );
      return;
    }

    if (!solicitationId || solicitationId <= 0) {
      setFormError(
        "Não foi possível identificar a solicitação do paciente."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:8080/sessao/store",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id_solicitacao: solicitationId,
            data_sessao: date,
            hora_inicio: startTime,
            hora_fim: endTime,
          }),
        }
      );

      const data: {
        sucesso?: boolean;
        mensagem?: string;
        erro?: string;
        sessao?: {
          id_sessao: number;
        };
      } = await response.json();

      if (!response.ok || !data.sucesso) {
        throw new Error(
          data.erro ||
            data.mensagem ||
            "Não foi possível agendar a sessão."
        );
      }

      setSubmittedSuccess(true);
      onSuccess?.();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao agendar a sessão."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={
        submittedSuccess
          ? "session-success-title"
          : "session-modal-title"
      }
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="relative max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#EBE5DA] bg-[#F9F6F0] p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar agendamento"
          className="absolute right-5 top-5 z-10 rounded-full p-2 text-[#7A6F62] transition-colors hover:bg-[#EBE5DA]"
        >
          <X className="h-5 w-5" />
        </button>

        {submittedSuccess ? (
          <div
            role="status"
            aria-live="polite"
            className="overflow-hidden rounded-2xl border border-[#B9DCD0] bg-[#EDF7F1]"
          >
            <div className="space-y-4 p-6 pt-10 text-center sm:p-8 sm:pt-10">
              <CheckCircle2
                aria-hidden="true"
                className="mx-auto h-12 w-12 text-[#4a8b7f]"
              />

              <h2
                id="session-success-title"
                className="font-serif text-2xl font-bold text-[#1F3A52]"
              >
                Sessão agendada!
              </h2>

              <p className="text-sm leading-relaxed text-[#356B5D]">
                A sessão de {patientName} foi registrada com sucesso.
              </p>

              <p className="text-xs text-[#356B5D]">
                Este aviso fechará automaticamente em 3 segundos.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-full bg-[#4a8b7f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d756b] focus:outline-none focus:ring-2 focus:ring-[#4a8b7f] focus:ring-offset-2"
              >
                Fechar agora
              </button>
            </div>

            <div
              className="h-1.5 w-full bg-[#D5E9DF]"
              aria-hidden="true"
            >
              <div
                className="h-full bg-[#4a8b7f]"
                style={{
                  width: `${countdownProgress}%`,
                  transition: "width 3000ms linear",
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3 pr-8">
              <PsiLogo size="sm" variant="measured" />

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a8b7f]">
                  Clínica-Escola Acolhe
                </span>

                <h2
                  id="session-modal-title"
                  className="font-serif text-2xl font-bold text-[#1F3A52]"
                >
                  Marcar Sessão
                </h2>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-[#7A6F62]">
              Preencha os dados da sessão para o paciente selecionado.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-2xl border border-[#EBE5DA] bg-white p-4">
                <p className="mb-1 text-xs text-[#7A6F62]">
                  Paciente
                </p>
                <p className="font-semibold text-[#1F3A52]">
                  {patientName}
                </p>
              </div>

              <div>
                <label
                  htmlFor="session-date"
                  className="mb-1.5 block text-xs font-semibold text-[#1F3A52]"
                >
                  Data da sessão *
                </label>

                <div className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6F62]"
                  />
                  <input
                    id="session-date"
                    type="date"
                    min={minDate}
                    required
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border border-[#EBE5DA] bg-white py-3 pl-10 pr-3 text-sm text-[#1F3A52] focus:border-[#4a8b7f] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="session-start"
                    className="mb-1.5 block text-xs font-semibold text-[#1F3A52]"
                  >
                    Hora de início *
                  </label>

                  <div className="relative">
                    <Clock3
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6F62]"
                    />
                    <input
                      id="session-start"
                      type="time"
                      required
                      value={startTime}
                      onChange={(event) =>
                        setStartTime(event.target.value)
                      }
                      className="w-full rounded-xl border border-[#EBE5DA] bg-white py-3 pl-10 pr-3 text-sm text-[#1F3A52] focus:border-[#4a8b7f] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="session-end"
                    className="mb-1.5 block text-xs font-semibold text-[#1F3A52]"
                  >
                    Hora de término *
                  </label>

                  <div className="relative">
                    <Clock3
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6F62]"
                    />
                    <input
                      id="session-end"
                      type="time"
                      required
                      min={startTime || undefined}
                      value={endTime}
                      onChange={(event) =>
                        setEndTime(event.target.value)
                      }
                      className="w-full rounded-xl border border-[#EBE5DA] bg-white py-3 pl-10 pr-3 text-sm text-[#1F3A52] focus:border-[#4a8b7f] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#E7C6C0] bg-[#FBF0ED] p-3 text-sm text-[#8B4035]"
                >
                  {formError}
                </div>
              )}

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#EBE5DA] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#EBE5DA] px-5 py-3 text-sm font-semibold text-[#1F3A52] transition-colors hover:bg-[#A3B8CC]/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4a8b7f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d756b] focus:outline-none focus:ring-2 focus:ring-[#4a8b7f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CalendarPlus className="h-4 w-4" />
                  {isSubmitting
                    ? "Agendando..."
                    : "Confirmar agendamento"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
