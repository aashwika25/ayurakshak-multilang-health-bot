import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ayurakshakAvatar from "@/assets/ayurakshak-avatar.png";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "or", name: "Odia", nativeName: "ଓଡିଆ" },
];

const LanguageSelector = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (langCode: string) => {
    navigate(`/chat/${langCode}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border shadow-lg">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src={ayurakshakAvatar} 
              alt="AYURAKSHAK Avatar" 
              className="w-24 h-24 rounded-full mx-auto border-4 border-primary"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">आयुरक्षक</h1>
          <h2 className="text-xl font-semibold text-foreground mb-1">AYURAKSHAK</h2>
          <p className="text-muted-foreground text-sm">
            Your Multilingual AI Health Assistant
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-center text-foreground mb-4">
            Choose your preferred language
          </h3>
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              variant="outline"
              className="w-full h-14 text-left justify-start border-2 border-border hover:border-primary hover:bg-accent transition-all duration-200"
            >
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">{lang.nativeName}</span>
                <span className="text-sm text-muted-foreground">{lang.name}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            ⚠️ For emergency, call 108 or visit nearest hospital
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LanguageSelector;