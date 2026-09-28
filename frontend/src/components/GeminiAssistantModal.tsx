import React, { useState } from "react";
import { X, Sparkles, Send, Bot, User, RefreshCw, AlertCircle } from "lucide-react";
import { UserRole } from "../types";

interface Message {
  sender: "user" | "gemini";
  text: string;
  time: string;
}

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole | "geral";
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({
  isOpen,
  onClose,
  userRole = "geral",
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "gemini",
      text:
        userRole === "paciente"
          ? "Olá! Sou o Assistente Inteligente Acolhe (Gemini 3). Estou aqui para tirar suas dúvidas sobre como funcionam as consultas gratuitas na clínica-escola, o que esperar da primeira sessão ou como agendar sua triagem. Em que posso te acolher hoje?"
          : userRole === "aluno"
          ? "Olá, colega de psicologia! Sou seu copiloto de estudos clínicos com Gemini 3. Posso ajudar na formulação teórica de hipóteses (TCC, Psicanálise, Fenomenologia), na estruturação de relatórios e na preparação para sua supervisão docente. Como posso apoiar seu caso hoje?"
          : userRole === "professor"
          ? "Prezado(a) professor(a) supervisor(a), sou o assistente acadêmico Gemini 3. Posso auxiliar com diretrizes do Conselho Federal de Psicologia, sugestões de intervenção didática e reflexões para supervisões em grupo."
          : "Olá! Sou o assistente da Clínica-Escola Acolhe com tecnologia Gemini 3. Como posso ajudar com informações sobre atendimentos, estágio ou supervisão na clínica-escola?",
      time: "Agora",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts: Record<string, string[]> = {
    paciente: [
      "Como funciona a primeira consulta?",
      "Quem irá me atender na clínica-escola?",
      "As consultas são realmente gratuitas e sigilosas?",
    ],
    aluno: [
      "Como estruturar a queixa principal em TCC?",
      "Quais perguntas fazer na primeira anamnese?",
      "Como relatar hipóteses diagnósticas no prontuário?",
    ],
    professor: [
      "Diretrizes do CFP para prontuário de estagiários",
      "Sugestões de devolutiva pedagógica construtiva",
      "Manejo de faltas e adesão ao tratamento",
    ],
    geral: [
      "Qual a diferença entre plantão e psicoterapia?",
      "Como a universidade supervisiona os estudantes?",
      "Como funciona o agendamento presencial e online?",
    ],
  };

  const currentPrompts = quickPrompts[userRole] || quickPrompts.geral;

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userText) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: userRole === "geral" ? "paciente" : userRole,
          prompt: textToSend,
          context: `Usuário no papel de ${userRole} na clínica-escola Acolhe`,
        }),
      });

      const data = await response.json();
      const botMessage: Message = {
        sender: "gemini",
        text: data.reply || "Acolho sua dúvida. Poderia detalhar mais para eu ajudar melhor?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "gemini",
          text: "Estamos com instabilidade de conexão momentânea. Por favor, sinta-se à vontade para nos contatar na recepção da clínica pelo telefone (61) 3234-6547.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-[#F9F6F0] rounded-3xl max-w-xl w-full h-[620px] max-h-[92vh] border border-[#EBE5DA] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#1F3A52] text-white p-4 sm:px-6 flex items-center justify-between border-b border-[#4A6984]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4a8b7f] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">
                  Assistente Acolhe
                </h3>
                <span className="text-[10px] bg-[#9CAF88] text-[#1F3A52] font-bold px-2 py-0.5 rounded-full">
                  Gemini 3
                </span>
              </div>
              <p className="text-[11px] text-[#A3B8CC]">
                Apoio ético e esclarecimentos • Modo {userRole.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#4A6984] text-[#A3B8CC] hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar assistente Gemini"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ethical Safety Notice */}
        <div className="bg-[#EBE5DA]/70 border-b border-[#EBE5DA] px-4 py-1.5 flex items-center gap-2 text-[11px] text-[#7A6F62]">
          <AlertCircle className="w-3.5 h-3.5 text-[#4a8b7f] shrink-0" />
          <span>
            Este assistente inteligente tem finalidade psicoeducativa e acadêmica. Não substitui consulta clínica nem supervisão presencial.
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "gemini" && (
                <div className="w-7 h-7 rounded-xl bg-[#4a8b7f] text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#1F3A52] text-white rounded-tr-none"
                    : "bg-white text-[#1F3A52] border border-[#EBE5DA] shadow-xs rounded-tl-none whitespace-pre-line"
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.sender === "user" ? "text-[#A3B8CC]" : "text-[#7A6F62]"
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-xl bg-[#967B62] text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#5a7a8a] italic p-2 bg-white/60 rounded-xl w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#4a8b7f]" />
              <span>Pensando com Gemini 3...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-white/70 border-t border-[#EBE5DA] space-y-2">
          <div className="text-[11px] font-semibold text-[#7A6F62]">
            Perguntas Frequentes:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] px-3 py-1.5 rounded-full bg-[#F4F0EA] hover:bg-[#EBE5DA] text-[#1F3A52] border border-[#EBE5DA] transition-colors text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#EBE5DA]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida sobre a clínica ou seu caso..."
              className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#EBE5DA] text-[#1F3A52] placeholder-[#7A6F62] focus:outline-none focus:border-[#4a8b7f]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#4a8b7f] disabled:opacity-40 text-white hover:bg-[#3d756b] transition-colors cursor-pointer"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
