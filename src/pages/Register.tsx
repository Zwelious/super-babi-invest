import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PiggyBank, ArrowLeft, Loader2 } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bankAccount: "",
    referredBy: "",
  });
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQ] = useState(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== captchaQ.answer) {
      toast({ title: t("Wrong captcha answer", "Jawaban captcha salah"), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: data.user.id,
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          bank_account: form.bankAccount,
          referred_by: form.referredBy || null,
        });
        if (profileError) throw profileError;
      }
      toast({
        title: t("Registration submitted!", "Pendaftaran terkirim!"),
        description: t("Please check your email to verify, then wait for admin approval.", "Silakan periksa email Anda untuk verifikasi, lalu tunggu persetujuan admin."),
      });
    } catch (err: any) {
      toast({ title: err.message || "Registration failed", variant: "destructive" });
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
            <CardTitle className="font-display text-2xl">{t("Member Registration", "Pendaftaran Anggota")}</CardTitle>
            <CardDescription>{t("Fill in your details to join Super Babi", "Isi data Anda untuk bergabung dengan Super Babi")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("Full Name", "Nama Lengkap")}</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("Enter your full name", "Masukkan nama lengkap")} />
              </div>
              <div className="space-y-2">
                <Label>{t("Email", "Email")}</Label>
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>{t("Password", "Kata Sandi")}</Label>
                <Input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>{t("Mobile Phone", "Nomor HP")}</Label>
                <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62..." />
              </div>
              <div className="space-y-2">
                <Label>{t("Bank Account (for disbursement)", "Rekening Bank (untuk pencairan)")}</Label>
                <Input required value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} placeholder={t("Bank name - Account number", "Nama bank - Nomor rekening")} />
              </div>
              <div className="space-y-2">
                <Label>{t("Referred By", "Direferensikan Oleh")}</Label>
                <Input value={form.referredBy} onChange={(e) => setForm({ ...form, referredBy: e.target.value })} placeholder={t("Name of referrer (optional)", "Nama referral (opsional)")} />
              </div>
              <div className="space-y-2">
                <Label>{t("Captcha", "Captcha")}: {captchaQ.a} + {captchaQ.b} = ?</Label>
                <Input required value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} placeholder={t("Your answer", "Jawaban Anda")} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("Register", "Daftar")}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t("Already a member?", "Sudah menjadi anggota?")}{" "}
                <Link to="/login" className="text-primary hover:underline">{t("Login here", "Masuk di sini")}</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
