import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";

export default function QuestionsAnswersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) { navigate("/login"); return null; }

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Questions & Answers</h1>

      <div className="text-center py-16">
        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-xl font-bold mb-2">No questions yet</h2>
        <p className="text-muted-foreground text-sm">Questions you ask on products will appear here</p>
      </div>
    </div>
  );
}
