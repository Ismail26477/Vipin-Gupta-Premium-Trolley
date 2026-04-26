import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) { navigate("/dashboard"); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) navigate("/dashboard");
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4"><span className="font-heading font-bold text-primary-foreground text-lg">AR</span></div>
          <h1 className="font-heading text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your AR Computer account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-card" />
          <div className="relative">
            <input type={showPw ? "text" : "password"} placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-card pr-10" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">Sign In</button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
        </p>
        <p className="text-center text-[10px] text-muted-foreground mt-2">Demo: Enter any email/password to login</p>
      </div>
    </div>
  );
}
