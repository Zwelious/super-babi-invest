import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PiggyBank, Check, X, TrendingUp, Bell, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "Password123";

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const chartConfig = {
  amount: { label: "Deposits", color: "hsl(var(--primary))" },
};

const AdminPanel = () => {
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Data states
  const [members, setMembers] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [disbursements, setDisbursements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Dialog states
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [activateTarget, setActivateTarget] = useState<any>(null);
  const [activationDate, setActivationDate] = useState(new Date().toISOString().split("T")[0]);
  const [disbursementDialogOpen, setDisbursementDialogOpen] = useState(false);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [newRate, setNewRate] = useState("30");
  const [newRateDate, setNewRateDate] = useState(new Date().toISOString().split("T")[0]);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyMemberId, setNotifyMemberId] = useState("");
  const [disbType, setDisbType] = useState("");
  const [disbAmount, setDisbAmount] = useState("");
  const [disbDate, setDisbDate] = useState("");
  const [disbMemberId, setDisbMemberId] = useState("");
  const [disbInvestmentId, setDisbInvestmentId] = useState("");
  const [viewNotification, setViewNotification] = useState<any>(null);

  const adminCall = useCallback(async (action: string, params: any = {}) => {
    const { data, error } = await supabase.functions.invoke("admin-api", {
      body: { action, ...params },
      headers: { "x-admin-password": ADMIN_PASSWORD },
    });
    if (error) throw error;
    return data;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, d, inv, r, dis, n, c] = await Promise.all([
        adminCall("get_members"),
        adminCall("get_deposits"),
        adminCall("get_investments"),
        adminCall("get_rates"),
        adminCall("get_disbursements"),
        adminCall("get_notifications"),
        adminCall("get_deposit_chart"),
      ]);
      setMembers(m || []);
      setDeposits(d || []);
      setInvestments(inv || []);
      setRates(r || []);
      setDisbursements(dis || []);
      setNotifications(n || []);
      setChartData(c || []);
    } catch (err: any) {
      toast({ title: "Failed to load data: " + err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [adminCall, toast]);

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  const handleAction = async (action: string, params: any, successMsg: string) => {
    try {
      await adminCall(action, params);
      toast({ title: successMsg });
      loadData();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="font-display text-center flex items-center justify-center gap-2">
              <PiggyBank className="h-6 w-6 text-primary" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && password === ADMIN_PASSWORD) setAuthenticated(true); else if (e.key === "Enter") toast({ title: "Incorrect password", variant: "destructive" }); }}
                placeholder="Enter admin password"
              />
            </div>
            <Button className="w-full" onClick={() => { if (password === ADMIN_PASSWORD) setAuthenticated(true); else toast({ title: "Incorrect password", variant: "destructive" }); }}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingMembers = members.filter(m => m.status === "pending");
  const pendingDeposits = deposits.filter(d => d.status === "pending");
  const approvedDeposits = deposits.filter(d => d.status === "approved" || d.status === "activated");
  const allMembers = members.filter(m => m.status === "approved");

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Super Babi Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Button variant="ghost" size="sm" onClick={loadData}>Refresh</Button>
            <Button variant="ghost" size="sm" asChild><Link to="/">Exit Admin</Link></Button>
          </div>
        </div>
      </nav>

      <main className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-6">Admin Panel</h1>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl">
            <TabsTrigger value="members">Members {pendingMembers.length > 0 && `(${pendingMembers.length})`}</TabsTrigger>
            <TabsTrigger value="deposits">Deposits {pendingDeposits.length > 0 && `(${pendingDeposits.length})`}</TabsTrigger>
            <TabsTrigger value="activate">Activate</TabsTrigger>
            <TabsTrigger value="disburse">Disburse</TabsTrigger>
            <TabsTrigger value="rates">Master Rate</TabsTrigger>
            <TabsTrigger value="notify">Notifications</TabsTrigger>
          </TabsList>

          {/* Members */}
          <TabsContent value="members">
            <Card>
              <CardHeader><CardTitle className="font-display">Pending Member Registrations</CardTitle></CardHeader>
              <CardContent>
                {pendingMembers.length === 0 ? <p className="text-muted-foreground text-sm">No pending registrations.</p> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Bank</TableHead><TableHead>Referred By</TableHead><TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingMembers.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.full_name}</TableCell>
                          <TableCell>{m.email}</TableCell>
                          <TableCell>{m.phone}</TableCell>
                          <TableCell>{m.bank_account}</TableCell>
                          <TableCell>{m.referred_by || "-"}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="sm" onClick={() => handleAction("approve_member", { id: m.id }, `Approved ${m.full_name}`)}><Check className="h-3 w-3" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleAction("reject_member", { id: m.id }, `Rejected ${m.full_name}`)}><X className="h-3 w-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposits */}
          <TabsContent value="deposits">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Member Deposits Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatRp(value as number)} />} />
                        <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : <p className="text-muted-foreground text-sm">No deposit data yet.</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="font-display">Pending Deposit Approvals</CardTitle></CardHeader>
                <CardContent>
                  {pendingDeposits.length === 0 ? <p className="text-muted-foreground text-sm">No pending deposits.</p> : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Receipt</TableHead><TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingDeposits.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium">{d.member_name}</TableCell>
                            <TableCell>{formatRp(Number(d.amount))}</TableCell>
                            <TableCell>{d.deposit_date}</TableCell>
                            <TableCell>
                              {d.receipt_url ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    try {
                                      const res = await adminCall("get_receipt_signed_url", { path: d.receipt_url });
                                      if (res?.url) window.open(res.url, "_blank", "noopener,noreferrer");
                                    } catch (err: any) {
                                      toast({ title: err.message, variant: "destructive" });
                                    }
                                  }}
                                >
                                  View
                                </Button>
                              ) : (
                                <Badge variant="secondary">None</Badge>
                              )}
                            </TableCell>
                            <TableCell className="flex gap-2">
                              <Button size="sm" onClick={() => handleAction("approve_deposit", { id: d.id }, "Deposit approved")}><Check className="h-3 w-3" /></Button>
                              <Button size="sm" variant="destructive" onClick={() => handleAction("reject_deposit", { id: d.id }, "Deposit rejected")}><X className="h-3 w-3" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activate */}
          <TabsContent value="activate">
            <Card>
              <CardHeader><CardTitle className="font-display">Activate Investments</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Activate approved deposits to start the investment period.</p>
                {approvedDeposits.length === 0 ? <p className="text-muted-foreground text-sm">No deposits to activate.</p> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead><TableHead>Amount</TableHead><TableHead>Deposit Date</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedDeposits.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell className="font-medium">{d.member_name}</TableCell>
                          <TableCell>{formatRp(Number(d.amount))}</TableCell>
                          <TableCell>{d.deposit_date}</TableCell>
                          <TableCell>
                            {d.status === "activated" ? <Badge className="bg-primary/20 text-primary">Activated</Badge> : <Badge variant="outline">Approved</Badge>}
                          </TableCell>
                          <TableCell>
                            {d.status === "approved" && (
                              <Dialog open={activateDialogOpen && activateTarget?.id === d.id} onOpenChange={(open) => { setActivateDialogOpen(open); if (open) setActivateTarget(d); }}>
                                <DialogTrigger asChild><Button size="sm">Activate</Button></DialogTrigger>
                                <DialogContent>
                                  <DialogHeader><DialogTitle className="font-display">Activate Investment</DialogTitle></DialogHeader>
                                  <div className="space-y-4 pt-2">
                                    <p className="text-sm text-muted-foreground">Activating <strong>{d.member_name}</strong>'s deposit of <strong>{formatRp(Number(d.amount))}</strong></p>
                                    <div className="space-y-2">
                                      <Label>Activation Date</Label>
                                      <Input type="date" value={activationDate} onChange={(e) => setActivationDate(e.target.value)} />
                                    </div>
                                    <Button className="w-full" onClick={async () => {
                                      await handleAction("activate_investment", {
                                        deposit_id: d.id, user_id: d.user_id, amount: Number(d.amount), activation_date: activationDate,
                                      }, "Investment activated");
                                      setActivateDialogOpen(false);
                                    }}>Activate Investment</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disburse */}
          <TabsContent value="disburse">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display">Disbursements</CardTitle>
                <Dialog open={disbursementDialogOpen} onOpenChange={setDisbursementDialogOpen}>
                  <DialogTrigger asChild><Button size="sm">New Disbursement</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-display">Record Disbursement</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Member</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={disbMemberId} onChange={(e) => setDisbMemberId(e.target.value)}>
                          <option value="">Select member...</option>
                          {allMembers.map(m => <option key={m.user_id} value={m.user_id}>{m.full_name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Investment</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={disbInvestmentId} onChange={(e) => {
                          const id = e.target.value;
                          setDisbInvestmentId(id);
                          const inv = investments.find(i => i.id === id);
                          if (inv && disbType) {
                            const auto = disbType === "interest_6" ? Number(inv.return_6) : disbType === "interest_12" ? Number(inv.return_12) : disbType === "investment_return" ? Number(inv.amount) : 0;
                            if (auto > 0) setDisbAmount(String(auto));
                          }
                        }}>
                          <option value="">Select investment...</option>
                          {investments.filter(i => i.user_id === disbMemberId).map(i => <option key={i.id} value={i.id}>{formatRp(Number(i.amount))} - {i.activation_date}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={disbType} onChange={(e) => {
                          const t = e.target.value;
                          setDisbType(t);
                          const inv = investments.find(i => i.id === disbInvestmentId);
                          if (inv && t) {
                            const auto = t === "interest_6" ? Number(inv.return_6) : t === "interest_12" ? Number(inv.return_12) : t === "investment_return" ? Number(inv.amount) : 0;
                            if (auto > 0) setDisbAmount(String(auto));
                          }
                        }}>
                          <option value="">Select...</option>
                          <option value="interest_6">Interest (6-month)</option>
                          <option value="interest_12">Interest (12-month)</option>
                          <option value="investment_return">Investment Return</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount (Rp)</Label>
                        <Input type="number" value={disbAmount} onChange={(e) => setDisbAmount(e.target.value)} />
                        <p className="text-xs text-muted-foreground">Auto-filled from the investment + type. You can override if needed.</p>
                      </div>
                      <div className="space-y-2"><Label>Date</Label><Input type="date" value={disbDate} onChange={(e) => setDisbDate(e.target.value)} /></div>
                      <Button
                        className="w-full"
                        disabled={!disbMemberId || !disbInvestmentId || !disbType || !disbDate || !disbAmount || Number(disbAmount) <= 0}
                        onClick={async () => {
                          if (!disbMemberId || !disbInvestmentId || !disbType || !disbDate) {
                            toast({ title: "Please fill in all fields", variant: "destructive" });
                            return;
                          }
                          const amt = Number(disbAmount);
                          if (!Number.isFinite(amt) || amt <= 0) {
                            toast({ title: "Amount must be greater than 0", variant: "destructive" });
                            return;
                          }
                          await handleAction("add_disbursement", { user_id: disbMemberId, investment_id: disbInvestmentId, amount: amt, type: disbType, disbursement_date: disbDate }, "Disbursement recorded");
                          setDisbursementDialogOpen(false);
                          setDisbType(""); setDisbAmount(""); setDisbDate(""); setDisbMemberId(""); setDisbInvestmentId("");
                        }}
                      >Record</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {disbursements.length === 0 ? <p className="text-muted-foreground text-sm">No disbursements yet.</p> : (
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Member</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {disbursements.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell>{d.member_name}</TableCell>
                          <TableCell>{d.type}</TableCell>
                          <TableCell>{formatRp(Number(d.amount))}</TableCell>
                          <TableCell>{d.disbursement_date}</TableCell>
                          <TableCell><Badge variant={d.status === "completed" ? "default" : "outline"}>{d.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rates */}
          <TabsContent value="rates">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display">Master Rate</CardTitle>
                <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
                  <DialogTrigger asChild><Button size="sm">New Rate</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-display">Set New Rate</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Annual Rate (%)</Label>
                        <Input type="number" min={0.01} step="0.01" value={newRate} onChange={(e) => setNewRate(e.target.value)} placeholder="30" />
                        <p className="text-xs text-muted-foreground">Must be greater than 0.</p>
                      </div>
                      <div className="space-y-2"><Label>Effective Date</Label><Input type="date" value={newRateDate} onChange={(e) => setNewRateDate(e.target.value)} /></div>
                      <Button className="w-full" disabled={!newRate || !newRateDate || Number(newRate) <= 0} onClick={async () => {
                        const rateNum = Number(newRate);
                        if (!newRateDate || !Number.isFinite(rateNum) || rateNum <= 0) {
                          toast({ title: "Annual rate must be greater than 0", variant: "destructive" });
                          return;
                        }
                        await handleAction("add_rate", { rate: rateNum, effective_date: newRateDate }, "Rate updated");
                        setRateDialogOpen(false); setNewRate("30"); setNewRateDate(new Date().toISOString().split("T")[0]);
                      }}>Save Rate</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {rates.length === 0 ? <p className="text-muted-foreground text-sm">No rates configured.</p> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Annual Rate</TableHead><TableHead>Effective Date (WIB)</TableHead><TableHead>Created (WIB)</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {(() => {
                        const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
                        // Find the currently-effective rate: latest effective_date <= today,
                        // tie-break by created_at desc (already the order from API).
                        const currentIdx = rates.findIndex(r => r.effective_date <= todayStr);
                        return rates.map((r, i) => {
                          const created = new Date(r.created_at).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                            dateStyle: "short",
                            timeStyle: "medium",
                          });
                          const isCurrent = i === currentIdx;
                          const isFuture = r.effective_date > todayStr;
                          return (
                            <TableRow key={r.id}>
                              <TableCell className="font-bold text-lg">{r.rate}%</TableCell>
                              <TableCell>{r.effective_date}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">{created} WIB</TableCell>
                              <TableCell>
                                {isCurrent
                                  ? <Badge className="bg-primary/20 text-primary">Current</Badge>
                                  : isFuture
                                    ? <Badge variant="secondary">Upcoming</Badge>
                                    : <Badge variant="outline">Previous</Badge>}
                              </TableCell>
                            </TableRow>
                          );
                        });
                      })()}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notify">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Send Notification to Member</CardTitle>
                <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
                  <DialogTrigger asChild><Button size="sm">New Notification</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-display">Send Notification</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Member</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={notifyMemberId} onChange={(e) => setNotifyMemberId(e.target.value)}>
                          <option value="">Select member...</option>
                          {allMembers.map(m => <option key={m.user_id} value={m.user_id}>{m.full_name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2"><Label>Title</Label><Input value={notifyTitle} onChange={(e) => setNotifyTitle(e.target.value)} placeholder="Investment Adjustment Notice" /></div>
                      <div className="space-y-2"><Label>Message</Label><Textarea value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} placeholder="Describe the impact..." rows={5} /></div>
                      <Button className="w-full" onClick={async () => {
                        await handleAction("send_notification", { user_id: notifyMemberId, title: notifyTitle, message: notifyMessage, type: "swine_death" }, "Notification sent");
                        setNotifyDialogOpen(false); setNotifyTitle(""); setNotifyMessage(""); setNotifyMemberId("");
                      }}>Send Notification</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Use this to notify members when a swine dies, affecting their deposit value and total investment returns.</p>
                {notifications.length === 0 ? <p className="text-muted-foreground text-sm">No notifications sent yet.</p> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Member</TableHead><TableHead>Title</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {notifications.map((n) => (
                        <TableRow key={n.id}>
                          <TableCell>{new Date(n.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{n.member_name}</TableCell>
                          <TableCell>{n.title}</TableCell>
                          <TableCell>{n.read ? <Badge variant="secondary">Read</Badge> : <Badge variant="destructive">Unread</Badge>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
