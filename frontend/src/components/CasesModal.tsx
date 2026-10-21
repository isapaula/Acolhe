
import React, { useCallback, useEffect, useState } from "react";
import {
  X,
  Search,
  Clock,
  FileText,
  LoaderCircle,
} from "lucide-react";

interface CaseItem {
  id_solicitacao: number;
  nome_paciente: string;
  especialidade: string;
  horario_desejado: string;
  observacao_inicial: string | null;
  solicitacoes_status: string;
}

interface CasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CasesResponse {
  casos_disponiveis?: CaseItem[];
  erro?: string;
}

export const CasesModal: React.FC<CasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseBeingAssigned, setCaseBeingAssigned] =
    useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:8080/aluno/casosDisponiveis",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data: CasesResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.erro || "Não foi possível carregar os casos disponíveis."
        );
      }

      setCases(data.casos_disponiveis ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao consultar os casos disponíveis."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSuccess(null);
      void loadCases();
    }
  }, [isOpen, loadCases]);

  const handleAssumeCase = async (idSolicitacao: number) => {
    try {
      setCaseBeingAssigned(idSolicitacao);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("id_solicitacao", String(idSolicitacao));

      const response = await fetch(
        "http://localhost:8080/aluno/assumir",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data: { mensagem?: string; erro?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.erro || "Não foi possível assumir este caso."
        );
      }

      setSuccess(data.mensagem || "Caso assumido com sucesso!");

      await loadCases();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao assumir o caso."
      );
    } finally {
      setCaseBeingAssigned(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F3A52]/50 p-3 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cases-modal-title"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-[#F9F6F0] shadow-xl"
      >
        {/* Cabeçalho */}
        <header className="flex items-center justify-between gap-3 border-b border-[#EBE5DA] bg-white px-4 py-3 sm:px-5">
          <div>
            <h3
              id="cases-modal-title"
              className="font-serif text-lg font-bold text-[#1F3A52]"
            >
              Casos disponíveis
            </h3>
            <p className="mt-0.5 text-xs text-[#7A6F62]">
              Confira os casos aprovados para atendimento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="rounded-full p-2 text-[#7A6F62] transition-colors hover:bg-[#F4F0EA]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Conteúdo */}
        <div className="space-y-3 overflow-y-auto p-3 sm:p-4">
          {success && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs text-green-800"
            >
              {success}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700"
            >
              {error}
              <button
                type="button"
                onClick={() => void loadCases()}
                className="ml-2 font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs text-[#5a7a8a]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Carregando casos...
            </div>
          ) : cases.length === 0 && !error ? (
            <div className="py-10 text-center">
              <Search className="mx-auto mb-2 h-7 w-7 text-[#A3B8CC]" />
              <p className="text-sm font-semibold text-[#1F3A52]">
                Nenhum caso disponível no momento.
              </p>
              <p className="mt-1 text-xs text-[#7A6F62]">
                Os casos aprovados aparecerão aqui.
              </p>
            </div>
          ) : (
            cases.map((item) => (
              <article
                key={item.id_solicitacao}
                className="rounded-xl border border-[#EBE5DA] bg-white px-3.5 py-3 transition-colors hover:border-[#A3B8CC]"
              >
                {/* Nome e especialidade */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="min-w-0 text-sm font-bold leading-5 text-[#1F3A52]">
                    {item.nome_paciente || "Nome não informado"}
                  </h4>

                  <span className="max-w-[48%] shrink-0 rounded-full bg-[#F4F0EA] px-2 py-1 text-[10px] leading-4 text-[#5a7a8a]">
                    {item.especialidade}
                  </span>
                </div>

                {/* Observação inicial */}
                <div className="mt-2 flex items-start gap-1.5">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7A6F62]" />

                  <p className="min-w-0 text-xs leading-4 text-[#7A6F62]">
                    <span className="font-medium">Observação: </span>
                    {item.observacao_inicial?.trim() ||
                      "Nenhuma observação informada."}
                  </p>
                </div>

                {/* Horário e ação */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F4F0EA] pt-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#5a7a8a]">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      Horário sugerido: {item.horario_desejado || "Não informado"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void handleAssumeCase(item.id_solicitacao)
                    }
                    disabled={caseBeingAssigned !== null}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1F3A52] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4A6984] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {caseBeingAssigned === item.id_solicitacao && (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    )}

                    {caseBeingAssigned === item.id_solicitacao
                      ? "Assumindo..."
                      : "Assumir caso"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Rodapé */}
        <footer className="flex justify-end border-t border-[#EBE5DA] bg-white px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#EBE5DA] px-3 py-2 text-xs font-semibold text-[#1F3A52] transition-colors hover:bg-[#F9F6F0]"
          >
            Fechar
          </button>
        </footer>
      </section>
    </div>
  );
};
