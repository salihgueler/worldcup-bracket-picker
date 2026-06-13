import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "aws-blocks";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Who will win between Brazil and Argentina?",
  "Tell me about France's squad.",
  "What's the community consensus for the final?",
  "How is my bracket looking?",
];

export function AIPredictorChat({ initialPrompt }: { initialPrompt?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastPromptRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = {
        id: `${Date.now()}-u`,
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      setError(null);

      try {
        const { reply } = await api.chatWithPredictor(trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-a`,
            role: "assistant",
            content: reply || "I couldn't come up with a response. Try again?",
          },
        ]);
      } catch (err) {
        console.error("Predictor chat failed", err);
        setError("The predictor is unavailable right now. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  // Auto-send a prompt forwarded from elsewhere in the app (e.g. "Ask AI").
  useEffect(() => {
    if (initialPrompt && initialPrompt !== lastPromptRef.current) {
      lastPromptRef.current = initialPrompt;
      void send(initialPrompt);
    }
  }, [initialPrompt, send]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">🤖</div>
        <div>
          <h3 className="text-white font-bold text-lg">AI Predictor</h3>
          <p className="text-white/40 text-xs">
            Powered by the Agent Building Block
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/6 bg-white/3 p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-white/50 text-sm mb-4">
              Ask me about teams, players, or who will win a match.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="text-xs text-gold-400 border border-gold-400/30 rounded-full px-3 py-1.5 hover:bg-gold-400/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-gold-400 text-navy-950 px-4 py-2.5 text-sm whitespace-pre-wrap"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 text-white/90 px-4 py-2.5 text-sm whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-white/8 text-white/60 px-4 py-2.5 text-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce [animation-delay:0.15s]">
                  ●
                </span>
                <span className="animate-bounce [animation-delay:0.3s]">●</span>
              </span>
            </div>
          </div>
        )}

        {error && <p className="text-center text-red-400 text-sm">{error}</p>}

        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI predictor..."
          disabled={loading}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold-400/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-gold-400 px-5 py-3 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
