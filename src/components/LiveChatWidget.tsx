import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const botReplies = [
  "Thanks for reaching out! How can I help you today?",
  "I'd be happy to help with that. Could you provide more details?",
  "Let me check that for you. One moment please!",
  "For order-related queries, please share your order ID.",
  "You can also email us at support@globalimports.com for detailed assistance.",
  "Our return policy allows returns within 7 days of delivery.",
  "We offer free shipping on orders above ₹999!",
  "Is there anything else I can help you with?",
];

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! 👋 Welcome to Global Imports. How can I help you today?", sender: "bot", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user", time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Bot auto-reply after delay
    setTimeout(() => {
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 1000 + Math.random() * 1500);
  };

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "440px" }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">Global Imports Support</p>
                  <p className="text-[10px] text-primary-foreground/70">Online • Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:opacity-70"><X className="w-5 h-5" /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm border border-border rounded-full px-4 py-2 bg-background outline-none focus:border-primary"
                />
                <button type="submit" className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
