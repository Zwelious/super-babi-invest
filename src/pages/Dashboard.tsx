import { Fragment, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { PiggyBank, LogOut, Upload, DollarSign, Calendar, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import NotificationBell from "@/components/NotificationBell";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_UNIT_PRICE = 3500000;

const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [depositUnits, setDepositUnits] = useState(1);
  const [depositOpen, setDepositOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [masterRate, setMasterRate] = useState(30);
  const [unitPrice, setUnitPrice] = useState(DEFAULT_UNIT_PRICE);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);
  const [depositFile, setDepositFile] = useState<File | null>(null);
  const [expandedDeposits, setExpandedDeposits] = useState<Set<string>>(new Set());
  const toggleExpanded = (id: string) => setExpandedDeposits(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

  const validateReceiptFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return t(
        "Invalid format. Only image files (JPG, PNG, WEBP, GIF) are allowed.",
        "Format tidak valid. Hanya file gambar (JPG, PNG, WEBP, GIF) yang diizinkan."
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return t("File too large. Maximum size is 5 MB.", "File terlalu besar. Ukuran maksimum 5 MB.");
    }
    return null;
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/superbabi/login"); return; }
      setUserId(user.id);

      // Use Asia/Jakarta (WIB) date so rates effective "today" in Indonesia
      // are picked up regardless of the user's UTC offset.
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      
      const [investRes, depositRes, rateRes, settingsRes] = await Promise.all([
        supabase.from("investments").select("*").order("activation_date", { ascending: false }),
        supabase.from("deposits").select("*").order("created_at", { ascending: false }),
        supabase
          .from("master_rates")
          .select("*")
          .lte("effective_date", today)
          .order("effective_date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(1),
        supabase.from("system_settings").select("value").eq("key", "unit_price").maybeSingle(),
      ]);

      if (investRes.data) setInvestments(investRes.data);
      if (depositRes.data) setDeposits(depositRes.data);
      if (rateRes.data?.[0]) setMasterRate(Number(rateRes.data[0].rate));
      if (settingsRes.data?.value) setUnitPrice(Number(settingsRes.data.value));
    };
    init();
  }, [navigate]);

  const depositAmount = depositUnits * unitPrice;
  // Master rate is annual and split equally between the two milestones.
  const estimated6Month = depositAmount * (masterRate / 200);
  const estimated12Month = depositAmount * (masterRate / 200);

  const totalDeposited = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalActive = investments.filter(i => i.status === "active").reduce((sum, i) => sum + Number(i.amount), 0);
  const totalPendingActivation = deposits
    .filter(d => d.status === "approved" || d.status === "activated")
    .reduce((sum, d) => sum + Math.max(0, Number(d.amount) - Number(d.activated_amount || 0)), 0);

  const handleDeposit = async () => {
    if (!userId) return;
    if (!depositFile) {
      toast({
        title: t("Transfer receipt is required", "Bukti transfer wajib diunggah"),
        variant: "destructive",
      });
      return;
    }
    const fileError = validateReceiptFile(depositFile);
    if (fileError) {
      toast({ title: fileError, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // 1. Insert deposit row
      const { data: deposit, error } = await supabase
        .from("deposits")
        .insert({ user_id: userId, units: depositUnits, amount: depositAmount })
        .select()
        .single();
      if (error) throw error;

      // 2. Upload receipt (only if provided)
      if (depositFile) {
        const fileExt = depositFile.name.split(".").pop();
        const filePath = `${userId}/${deposit.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(filePath, depositFile, { upsert: true, contentType: depositFile.type });
        if (uploadError) throw uploadError;

        // 3. Persist receipt path via admin edge function
        const { data: updateData, error: updateError } = await supabase.functions.invoke("admin-api", {
          body: { action: "update_deposit_receipt", id: deposit.id, receipt_url: filePath },
        });
        if (updateError) {
          const detail = (updateData as any)?.error || updateError.message;
          throw new Error(detail);
        }
        if (updateData && (updateData as any).error) throw new Error((updateData as any).error);
      }

      toast({ title: t("Deposit submitted", "Setoran terkirim") });
      setDepositOpen(false);
      setDepositUnits(1);
      setDepositFile(null);
      // Refresh
      const { data } = await supabase.from("deposits").select("*").order("created_at", { ascending: false });
      if (data) setDeposits(data);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadReceipt = async () => {
    if (!selectedFile || !selectedDepositId) return;
    const fileError = validateReceiptFile(selectedFile);
    if (fileError) {
      toast({ title: fileError, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${userId}/${selectedDepositId}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, selectedFile, {
        upsert: true,
        contentType: selectedFile.type,
      });
      if (uploadError) throw uploadError;

      // Persist the storage path on the deposit row via the admin edge function
      // (regular users have no UPDATE policy on deposits)
      const { error: updateError } = await supabase.functions.invoke("admin-api", {
        body: { action: "update_deposit_receipt", id: selectedDepositId, receipt_url: filePath },
      });
      if (updateError) throw updateError;

      toast({ title: t("Receipt uploaded", "Bukti transfer diunggah") });
      setUploadOpen(false);
      setSelectedFile(null);
      setSelectedDepositId(null);

      // Refresh deposits so the UI reflects the new receipt
      const { data } = await supabase.from("deposits").select("*").order("created_at", { ascending: false });
      if (data) setDeposits(data);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/superbabi");
  };

  const getStatusBadge = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    if (d <= now) return <Badge className="ml-2">{t("Matured", "Jatuh Tempo")}</Badge>;
    return <Badge variant="secondary" className="ml-2">{t("Upcoming", "Akan datang")}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <Link to="/superbabi" className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Super Babi</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LanguageToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />{t("Logout", "Keluar")}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container py-8 space-y-8">
        <h1 className="font-display text-3xl font-bold">{t("Investment Dashboard", "Dashboard Investasi")}</h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t("Total Deposited", "Total Setoran")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{formatRp(totalDeposited)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t("Active Investment", "Investasi Aktif")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{formatRp(totalActive)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t("Pending Activation", "Menunggu Aktivasi")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{formatRp(totalPendingActivation)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  "Approved deposits not yet allocated to a batch. Interest starts on activation.",
                  "Setoran disetujui yang belum dialokasikan ke batch. Bunga dihitung saat aktivasi."
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Investments */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t("Active Investments", "Investasi Aktif")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">{t("No active investments yet.", "Belum ada investasi aktif.")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Investment", "Investasi")}</TableHead>
                    <TableHead>{t("Start Date", "Tanggal Mulai")}</TableHead>
                    <TableHead>{t("6-Month Maturity", "Jatuh Tempo 6 Bulan")}</TableHead>
                    <TableHead>{t("6-Month Return", "Pengembalian 6 Bulan")}</TableHead>
                    <TableHead>{t("12-Month Maturity", "Jatuh Tempo 12 Bulan")}</TableHead>
                    <TableHead>{t("12-Month Return", "Pengembalian 12 Bulan")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{formatRp(Number(inv.amount))}</TableCell>
                      <TableCell>{inv.activation_date}</TableCell>
                      <TableCell>
                        {inv.maturity_6_date}
                        {getStatusBadge(inv.maturity_6_date)}
                      </TableCell>
                      <TableCell className="text-primary font-semibold">{formatRp(Number(inv.return_6))}</TableCell>
                      <TableCell>
                        {inv.maturity_12_date}
                        {getStatusBadge(inv.maturity_12_date)}
                      </TableCell>
                      <TableCell className="text-primary font-semibold">{formatRp(Number(inv.return_12))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Deposits History */}
        {deposits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display">{t("Deposit History", "Riwayat Setoran")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>{t("Deposit ID", "ID Setoran")}</TableHead>
                    <TableHead>{t("Date", "Tanggal")}</TableHead>
                    <TableHead>{t("Units", "Unit")}</TableHead>
                    <TableHead>{t("Amount", "Jumlah")}</TableHead>
                    <TableHead>{t("Status", "Status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits.map((d) => {
                    const children = investments.filter((i) => i.deposit_id === d.id);
                    const isOpen = expandedDeposits.has(d.id);
                    return (
                      <Fragment key={d.id}>
                        <TableRow>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toggleExpanded(d.id)} aria-label="Toggle details">
                              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{d.id.slice(0, 8).toUpperCase()}</TableCell>
                          <TableCell>{d.deposit_date}</TableCell>
                          <TableCell>{d.units}</TableCell>
                          <TableCell>{formatRp(Number(d.amount))}</TableCell>
                          <TableCell>
                            <Badge variant={d.status === "approved" || d.status === "activated" ? "default" : d.status === "rejected" ? "destructive" : "secondary"}>
                              {d.status === "activated" ? t("Activated", "Aktif") : d.status === "approved" ? t("Approved", "Disetujui") : d.status === "rejected" ? t("Rejected", "Ditolak") : t("Pending", "Menunggu")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        {isOpen && (
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={6} className="py-3">
                              <div className="pl-8">
                                <p className="text-xs font-semibold text-muted-foreground mb-2">
                                  {t("Investment Details", "Detail Investasi")} ({children.length})
                                </p>
                                {children.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    {t("No investments activated from this deposit yet.", "Belum ada investasi yang diaktifkan dari setoran ini.")}
                                  </p>
                                ) : (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>{t("Activation Date", "Tanggal Aktivasi")}</TableHead>
                                        <TableHead>{t("Amount", "Jumlah")}</TableHead>
                                        <TableHead>{t("6-Month Maturity", "Jatuh Tempo 6 Bulan")}</TableHead>
                                        <TableHead>{t("12-Month Maturity", "Jatuh Tempo 12 Bulan")}</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {children.map((inv) => (
                                        <TableRow key={inv.id}>
                                          <TableCell>{inv.activation_date}</TableCell>
                                          <TableCell className="font-medium">{formatRp(Number(inv.amount))}</TableCell>
                                          <TableCell>{inv.maturity_6_date}</TableCell>
                                          <TableCell>{inv.maturity_12_date}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>

            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4 flex-wrap">
          <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
            <DialogTrigger asChild>
              <Button size="lg"><DollarSign className="h-4 w-4 mr-1" />{t("Make Deposit", "Lakukan Setoran")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">{t("New Deposit", "Setoran Baru")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t("Number of Units", "Jumlah Unit")} (1 {t("unit", "unit")} = {formatRp(unitPrice)})</Label>
                  <Input type="number" min={1} value={depositUnits} onChange={(e) => setDepositUnits(Math.max(1, parseInt(e.target.value) || 1))} />
                  <p className="text-sm text-muted-foreground">{t("Total Deposit", "Total Setoran")}: <span className="font-semibold text-foreground">{formatRp(depositAmount)}</span></p>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{t("Estimated Returns", "Estimasi Pengembalian")} ({t("Rate", "Suku Bunga")}: {masterRate}%)</p>
                    <div className="flex justify-between">
                      <span className="text-sm">{t(`6-Month Return (${masterRate/2}%)`, `Pengembalian 6 Bulan (${masterRate/2}%)`)}:</span>
                      <span className="font-semibold text-primary">{formatRp(estimated6Month)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t(`12-Month Return (${masterRate/2}%)`, `Pengembalian 12 Bulan (${masterRate/2}%)`)}:</span>
                      <span className="font-semibold text-primary">{formatRp(estimated12Month)}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label>{t("Transfer Receipt", "Bukti Transfer")} <span className="text-destructive">*</span></Label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f) {
                        const err = validateReceiptFile(f);
                        if (err) {
                          toast({ title: err, variant: "destructive" });
                          e.target.value = "";
                          setDepositFile(null);
                          return;
                        }
                      }
                      setDepositFile(f);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "Accepted formats: JPG, PNG, WEBP, GIF. Max size: 5 MB.",
                      "Format yang diterima: JPG, PNG, WEBP, GIF. Ukuran maks: 5 MB."
                    )}
                  </p>
                  {depositFile && (
                    <p className="text-xs text-primary">
                      {depositFile.name} ({(depositFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <Button className="w-full" onClick={handleDeposit} disabled={loading || !depositFile}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t("Submit Deposit", "Kirim Setoran")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
