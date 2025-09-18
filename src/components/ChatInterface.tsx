import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Paperclip, 
  MapPin, 
  ArrowLeft,
  Phone,
  MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ayurakshakAvatar from "@/assets/ayurakshak-avatar.png";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  type?: "text" | "emergency" | "warning";
}

const languageNames: Record<string, string> = {
  en: "English",
  hi: "हिंदी",
  te: "తెలుగు", 
  or: "ଓଡିଆ"
};

const ChatInterface = () => {
  const { langCode = "en" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content: `🙏 Welcome to AYURAKSHAK! I'm your AI health assistant. How can I help you today?\n\n⚠️ Remember: I provide general health information only. Please consult a doctor for proper medical advice.`,
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const addMessage = (content: string, sender: "user" | "bot", type: "text" | "emergency" | "warning" = "text") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getBotResponse = (userMessage: string): { content: string; type: "text" | "emergency" | "warning" } => {
    const msg = userMessage.toLowerCase();
    
    // Emergency keywords
    if (msg.includes("sos") || msg.includes("😭") || msg.includes("emergency") || msg.includes("help me")) {
      return {
        content: `🚨 EMERGENCY DETECTED!\n\nImmediate Actions:\n📞 Call 108 (Emergency)\n📞 Call 104 (Health Helpline)\n🏥 Visit nearest hospital\n\n📍 Find hospitals near you: https://www.google.com/maps/search/hospital+near+me\n\n⚠️ Please seek immediate medical attention.`,
        type: "emergency"
      };
    }

    // Pain-related symptoms
    if (msg.includes("pain") || msg.includes("दर्द") || msg.includes("ache") || msg.includes("hurt")) {
      return {
        content: `I understand you're experiencing pain. Here's what you can do:\n\n💊 For mild pain:\n• Rest the affected area\n• Apply ice/heat as appropriate\n• Take over-the-counter pain relief if suitable\n\n📞 Call 104 (Health Helpline) for guidance\n🏥 If severe, visit: https://www.google.com/maps/search/hospital+near+me\n\n⚠️ Please consult a doctor before following this advice.`,
        type: "warning"
      };
    }

    // Fever symptoms
    if (msg.includes("fever") || msg.includes("बुखार") || msg.includes("temperature") || msg.includes("hot")) {
      return {
        content: `For fever management:\n\n🌡️ Monitor temperature regularly\n💧 Stay hydrated - drink plenty of fluids\n🛌 Get adequate rest\n🍯 Consider lukewarm water with honey\n\n⚠️ If fever >101°F (38.3°C) or persists >3 days, consult a doctor immediately.\n\n📞 Health Helpline: 104\n\n⚠️ Please consult a doctor before following this advice.`,
        type: "text"
      };
    }

    // Myth-busting
    if (msg.includes("garlic") && (msg.includes("cure") || msg.includes("treat"))) {
      return {
        content: `⚠️ MYTH BUSTER ALERT!\n\nGarlic does NOT cure serious diseases like TB, COVID, or cancer. While garlic has some health benefits, it cannot replace proper medical treatment.\n\n📚 Official guidelines: https://www.who.int\n💊 Always follow prescribed medications\n👨‍⚕️ Consult healthcare professionals\n\n⚠️ Please consult a doctor before following this advice.`,
        type: "warning"
      };
    }

    // Cough symptoms  
    if (msg.includes("cough") || msg.includes("खांसी") || msg.includes("cold")) {
      return {
        content: `For cough and cold relief:\n\n🍵 Warm liquids (herbal tea, warm water)\n🍯 Honey with lukewarm water\n💨 Steam inhalation\n🛌 Adequate rest\n😷 Wear mask to prevent spread\n\n⚠️ If cough persists >2 weeks or has blood, see a doctor immediately.\n\n📞 Health Helpline: 104\n\n⚠️ Please consult a doctor before following this advice.`,
        type: "text"
      };
    }

    // General health query
    return {
      content: `Thank you for your message: "${userMessage}"\n\nI'm here to help with health-related questions. You can ask me about:\n\n🤒 Common symptoms (fever, cough, pain)\n💊 General health advice\n🚨 Emergency guidance\n🏥 Finding nearby hospitals\n\nWhat specific health concern can I help you with?\n\n⚠️ Please consult a doctor before following this advice.`,
      type: "text"
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, "user");
    setInputText("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const response = getBotResponse(inputText);
      addMessage(response.content, "bot", response.type);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addMessage(`📎 Uploaded: ${file.name}`, "user");
      setTimeout(() => {
        addMessage(`I received your file: "${file.name}". I can help analyze medical reports and prescriptions.\n\n📋 For prescription analysis, I can explain:\n• Dosage instructions\n• Medicine timing\n• Possible side effects\n\n📊 For lab reports, I can help interpret basic values.\n\n⚠️ Please consult a doctor before following this advice.`, "bot");
      }, 1500);
    }
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      addMessage("📍 Sharing location...", "user");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            addMessage(`📍 Location received!\n\nFinding nearby healthcare facilities:\n🏥 Hospitals: https://www.google.com/maps/search/hospital+near+me\n💊 Pharmacies: https://www.google.com/maps/search/pharmacy+near+me\n🩺 Clinics: https://www.google.com/maps/search/clinic+near+me\n\n📞 Emergency: 108\n📞 Health Helpline: 104\n\n⚠️ Please consult a doctor before following this advice.`, "bot");
          }, 1000);
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enable location to find nearby healthcare facilities.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location not supported", 
        description: "Your device doesn't support location services.",
        variant: "destructive"
      });
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-dark text-primary-foreground p-4 flex items-center gap-3 shadow-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-primary-foreground hover:bg-primary/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <img 
          src={ayurakshakAvatar} 
          alt="AYURAKSHAK" 
          className="w-10 h-10 rounded-full border-2 border-primary-foreground/20"
        />
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg">AYURAKSHAK</h3>
          <p className="text-xs text-primary-foreground/80">
            {languageNames[langCode]} • Online • AI Health Assistant
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-primary/20"
        >
          <Phone className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-primary/20"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm ${
                  message.sender === "user"
                    ? "bg-chat-user text-chat-user-foreground rounded-br-md"
                    : message.type === "emergency"
                    ? "bg-health-emergency text-white rounded-bl-md"
                    : message.type === "warning" 
                    ? "bg-health-warning text-white rounded-bl-md"
                    : "bg-chat-bot text-chat-bot-foreground rounded-bl-md"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {formatMessage(message.content)}
                </div>
                <div className={`text-xs mt-2 ${
                  message.sender === "user" 
                    ? "text-chat-user-foreground/70"
                    : message.type === "emergency" || message.type === "warning"
                    ? "text-white/70"
                    : "text-chat-bot-foreground/70"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <Card className="bg-chat-bot text-chat-bot-foreground p-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">AYURAKSHAK is typing...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLocationShare}
              className="text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your health question..."
              className="pr-12 py-3 rounded-3xl border-2 focus:border-primary"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />
    </div>
  );
};

export default ChatInterface;