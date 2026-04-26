import { useState } from "react";
import { MessageCircle, ThumbsUp, ChevronDown, ChevronUp, Send } from "lucide-react";
import { toast } from "sonner";

interface QAItem {
  id: string;
  question: string;
  askedBy: string;
  date: string;
  answer?: string;
  answeredBy?: string;
  answerDate?: string;
  helpful: number;
}

const demoQA: QAItem[] = [
  {
    id: "qa-1",
    question: "Does this product come with a warranty card?",
    askedBy: "Rahul S.",
    date: "2026-02-15",
    answer: "Yes, all products come with a manufacturer warranty card included in the box.",
    answeredBy: "AR Computer Support",
    answerDate: "2026-02-16",
    helpful: 12,
  },
  {
    id: "qa-2",
    question: "Is this compatible with older models?",
    askedBy: "Priya M.",
    date: "2026-02-20",
    answer: "Please check the compatibility section in specifications. Generally, it supports models from the last 3 years.",
    answeredBy: "AR Computer Support",
    answerDate: "2026-02-21",
    helpful: 8,
  },
  {
    id: "qa-3",
    question: "Can I get this in a different color?",
    askedBy: "Ankit K.",
    date: "2026-03-01",
    helpful: 3,
  },
];

interface ProductQAProps {
  productId: string;
}

export default function ProductQA({ productId }: ProductQAProps) {
  const [questions, setQuestions] = useState<QAItem[]>(demoQA);
  const [newQuestion, setNewQuestion] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());

  const displayed = showAll ? questions : questions.slice(0, 2);

  const handleAsk = () => {
    if (!newQuestion.trim()) return;
    const q: QAItem = {
      id: `qa-${Date.now()}`,
      question: newQuestion.trim(),
      askedBy: "You",
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };
    setQuestions([q, ...questions]);
    setNewQuestion("");
    toast.success("Question posted! You'll be notified when answered.");
  };

  const handleHelpful = (id: string) => {
    if (helpedIds.has(id)) return;
    setHelpedIds(new Set([...helpedIds, id]));
    setQuestions(questions.map(q => q.id === id ? { ...q, helpful: q.helpful + 1 } : q));
  };

  return (
    <div>
      <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Questions & Answers ({questions.length})
      </h3>

      {/* Ask a question */}
      <div className="flex gap-2 mb-6">
        <input
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask a question about this product..."
          className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={handleAsk}
          disabled={!newQuestion.trim()}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Send className="w-4 h-4" /> Ask
        </button>
      </div>

      {/* Q&A list */}
      <div className="space-y-4">
        {displayed.map((qa) => (
          <div key={qa.id} className="bg-secondary/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">Q</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{qa.question}</p>
                <p className="text-xs text-muted-foreground mt-1">{qa.askedBy} · {qa.date}</p>
              </div>
            </div>

            {qa.answer && (
              <div className="flex items-start gap-3 mt-3 ml-9 pl-3 border-l-2 border-primary/20">
                <span className="shrink-0 w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center text-xs font-bold mt-0.5">A</span>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{qa.answer}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-muted-foreground">{qa.answeredBy} · {qa.answerDate}</p>
                    <button
                      onClick={() => handleHelpful(qa.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${helpedIds.has(qa.id) ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
                    >
                      <ThumbsUp className="w-3 h-3" /> Helpful ({qa.helpful})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!qa.answer && (
              <p className="text-xs text-muted-foreground italic mt-2 ml-9">Awaiting answer from seller...</p>
            )}
          </div>
        ))}
      </div>

      {questions.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline"
        >
          {showAll ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> View all {questions.length} questions</>}
        </button>
      )}
    </div>
  );
}
