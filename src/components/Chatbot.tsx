import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
  time: string;
}

const botResponses: Record<string, string> = {
  temperature: "Current temperature is within normal range (28–40°C). If it exceeds 40°C, a critical alert will be triggered automatically.",
  co: "CO gas levels are monitored continuously. Safe threshold is below 50 ppm. Levels above this trigger an immediate evacuation alert.",
  humidity: "Humidity is tracked in real-time. Levels above 80% may affect equipment and worker comfort.",
  alert: "You can view all active alerts in the Alerts page. Critical alerts trigger a blinking red indicator in the navbar.",
  sensor: "MicroQI supports up to 24 sensor nodes across 4 industrial zones. Check the Sensor Nodes page for live status.",
  zone: "There are 4 monitored zones. Each zone's safety status is color-coded: Green (Safe), Yellow (Warning), Red (Dangerous).",
  help: "I can help with: temperature, CO levels, humidity, alerts, sensors, zones, and reports. Just ask!",
  report: "Reports show daily averages for temperature, CO, PM2.5, and total alert counts. Visit the Reports page for details.",
  pm25: "PM2.5 (fine dust) is monitored continuously. Safe limit is below 100 µg/m³. Exceeding this triggers a warning.",
  voc: "VOC (Volatile Organic Compounds) are tracked in ppb. Levels above 300 ppb indicate potential hazardous conditions.",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes("hello") || lower.includes("hi"))
    return "Hello! I'm the MicroQI assistant. How can I help you with air quality monitoring today?";
  if (lower.includes("thank"))
    return "You're welcome! Stay safe. 🛡️";
  return "I'm not sure about that. Try asking about temperature, CO, humidity, alerts, sensors, zones, or reports. Type 'help' for a full list.";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      content: "Welcome to MicroQI Support! 👋 How can I assist you with air quality monitoring today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), role: "user", content: input, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply = getBotReply(input);
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-80 h-[440px] bg-card border border-border rounded-lg shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-navbar text-navbar-foreground px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm font-semibold">MicroQI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "bot"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.role === "bot" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "bot"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-1 ${
                      msg.role === "bot" ? "text-muted-foreground" : "text-primary-foreground/70"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-2 flex gap-2 shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about air quality..."
              className="text-xs h-8"
            />
            <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleSend}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
