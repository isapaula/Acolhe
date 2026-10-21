import React, { useState } from "react";
import { CheckCircle, LoaderCircle, X } from "lucide-react";

export interface SessionToComplete {
  id_sessao: number;
  id_solicitacao: number;
  nome_paciente: string;
  data_sessao: string;
  hora_inicio: string;
  hora_fim: string;
  status_sessao: string;
}

interface SessionCompletionModalProps {
  session: SessionToComplete | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const SessionCompletionModal: React.FC<
  SessionCompletionModalProps
> = ({ session, onClose, onSuccess }) => {
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) return null;

  const registrarRealizacao = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:8080/sessao/registrarRealizacao",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_sessao: session.id_sessao,
            observacao: observation.trim(),
          }),
        }
      );

      const data: { mensagem?: string; erro?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.erro || data.mensagem || "Não foi possível registrar a sessão."
        );
      }

      onSuccess();
      onClose();
      setObservation("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao registrar a sessão."
      );
    } finally {
      setLoading(false);
    }
  };

  const [year, month, day] = session.data_sessao.split("-").map(Number);
  const dataFormatada = new Intl.DateTimeFormat("pt-BR").format(
    new Date(year, month - 1, day)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F3A52]/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="completion-modal-title"
        className="w-full max-w-lg space-y-5 rounded-3xl border border-[#EBE5DA] bg-[#F9F6F0] p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#E3EEE8]">
              <CheckCircle className="h-5 w-5 text-[#4a8b7f]" />
            </div>

            <h2
              id="completion-modal-title"
              className="font-serif text-xl font-bold text-[#1F3A52]"
            >
              Registrar realização
            </h2>

            <p className="mt-1 text-sm text-[#7A6F62]">
              Confirme que a sessão aconteceu e registre uma observação, se
              necessário.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar"
            className="rounded-full p-2 text-[#7A6F62] hover:bg-[#EBE5DA] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2 rounded-2xl border border-[#EBE5DA] bg-white p-4">
          <p className="font-semibold text-[#1F3A52]">
            {session.nome_paciente}
          </p>
          <p className="text-sm text-[#5a7a8a]">
            {dataFormatada} · {session.hora_inicio.slice(0, 5)} às{" "}
            {session.hora_fim.slice(0, 5)}
          </p>
        </div>

        <div>
          <label
            htmlFor="completion-observation"
            className="mb-2 block text-sm font-semibold text-[#1F3A52]"
          >
            Observação da sessão (opcional)
          </label>

          <textarea
            id="completion-observation"
            rows={3}
            maxLength={100}
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            placeholder="Registre uma observação breve..."
            disabled={loading}
            className="w-full resize-none rounded-xl border border-[#EBE5DA] bg-white px-3.5 py-3 text-sm text-[#1F3A52] focus:border-[#4a8b7f] focus:outline-none disabled:opacity-60"
          />

          <p className="mt-1 text-right text-xs text-[#7A6F62]">
            {observation.length}/100 caracteres
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-[#EBE5DA] px-5 py-3 text-sm font-semibold text-[#5a7a8a] hover:bg-white disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void registrarRealizacao()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4a8b7f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3d756b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {loading ? "Registrando..." : "Confirmar realização"}
          </button>
        </div>
      </section>
    </div>
  );
};