import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "en" ? "id" : "en")}
      className="gap-1.5"
    >
      <Globe className="h-4 w-4" />
      {lang === "en" ? "ID" : "EN"}
    </Button>
  );
};

export default LanguageToggle;
