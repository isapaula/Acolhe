import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Gemini 3 AI Route for psychology clinic assistance
app.post("/api/gemini/assist", async (req: Request, res: Response) => {
  try {
    const { role, prompt, context } = req.body;
    const ai = getAI();

    let systemInstruction = `Você é o assistente virtual da Clínica-Escola Acolhe, uma clínica-escola de psicologia universitária que conecta a comunidade a alunos estagiários (8º ao 10º semestre) e professores supervisores. 
Sua comunicação deve ser acolhedora, empática, ética e profissional, alinhada aos preceitos do Código de Ética Profissional do Psicólogo (CFP).`;

    if (role === "paciente") {
      systemInstruction += `\nVocê está conversando com um paciente da comunidade. Forneça acolhimento inicial, psicoeducação calorosa e tire dúvidas sobre os atendimentos gratuitos da clínica-escola. NUNCA faça diagnósticos fechados. Em situações de emergência emocional severa, oriente a ligar para o CVV 188 ou procurar uma UPA.`;
    } else if (role === "aluno") {
      systemInstruction += `\nVocê está conversando com um estudante de psicologia em estágio clínico supervisionado. Ajude-o a refletir criticamente sobre formulações de caso (sob abordagens como TCC, Psicanálise ou Fenomenologia), anamnese e estrutura de prontuários éticos. Lembre sempre que todas as decisões devem ser validadas com o professor supervisor.`;
    } else if (role === "professor") {
      systemInstruction += `\nVocê está conversando com um professor supervisor docente. Auxilie com sugestões pedagógicas para supervisão clínica, estruturação de devolutivas para alunos e diretrizes éticas do CFP.`;
    }

    if (!ai) {
      // Warm, supportive default response if API key is not yet set
      const roleResponses: Record<string, string> = {
        paciente: "Olá! Agradecemos seu contato com a Clínica-Escola Acolhe. Nosso objetivo é oferecer um espaço seguro, acolhedor e sigiloso de escuta psicológica gratuita para a comunidade. Seus atendimentos são conduzidos por estudantes dos últimos semestres, sob supervisão contínua de professores mestres e doutores. Como posso te orientar hoje a respeito do seu agendamento ou do funcionamento das consultas?",
        aluno: "Olá, futuro psicólogo(a)! Como posso apoiar seus estudos de caso hoje? Lembre-se de organizar sua evolução no prontuário considerando a queixa principal, hipóteses compreensivas pela abordagem escolhida (TCC, Psicanálise ou Fenomenológica) e metas para a próxima sessão de supervisão.",
        professor: "Prezado(a) professor(a) supervisor(a), o painel acadêmico está pronto para registrar as avaliações dos estagiários e assinar digitalmente os prontuários dos atendimentos realizados nesta semana.",
      };
      return res.json({
        reply: roleResponses[role] || "Como posso ajudar com sua consulta ou formação na clínica-escola?",
        isFallback: true,
      });
    }

    const fullPrompt = `${context ? `Contexto atual: ${context}\n\n` : ""}Pergunta/Mensagem do usuário: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Desculpe, não consegui processar sua solicitação no momento.";
    return res.json({ reply, isFallback: false });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Falha ao consultar o assistente inteligente",
      message: error?.message || "Erro desconhecido",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
