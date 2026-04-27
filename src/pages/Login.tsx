import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { PiggyBank, ArrowLeft, Loader2 } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Check profile approval status
      const { data: profile } = await supabase.from("profiles").select("status").limit(1).maybeSingle();
      if (profile?.status === "pending") {
        await supabase.auth.signOut();
        toast({ title: t("Account pending approval", "Akun menunggu persetujuan"), description: t("Please wait for admin to approve your registration.", "Mohon tunggu persetujuan admin."), variant: "destructive" });
        return;
      }
      if (profile?.status === "rejected") {
        await supabase.auth.signOut();
        toast({ title: t("Account rejected", "Akun ditolak"), variant: "destructive" });
        return;
      }
      navigate("/superbabi/member");
    } catch (err: any) {
      toast({ title: err.message || "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Link to="/superbabi" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Super Babi</span>
          </Link>
          <LanguageToggle />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">{t("Member Login", "Masuk Anggota")}</CardTitle>
            <CardDescription>{t("Access your investment dashboard", "Akses dashboard investasi Anda")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("Email", "Email")}</Label>
                <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>{t("Password", "Kata Sandi")}</Label>
                <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("Login", "Masuk")}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t("Not a member yet?", "Belum menjadi anggota?")}{" "}
                <Link to="/register" className="text-primary hover:underline">{t("Register here", "Daftar di sini")}</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
