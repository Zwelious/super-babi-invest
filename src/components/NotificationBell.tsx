import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

const NotificationBell = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      for (const id of unreadIds) {
        await supabase.from("notifications").update({ read: true }).eq("id", id);
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between pr-4">
            <SheetTitle className="font-display">
              {t("Notifications", "Notifikasi")}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={markAllRead} className="text-xs">
                {t("Mark all read", "Tandai semua dibaca")}
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
          <div className="space-y-4">
            {notifications.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">
                {t("No notifications", "Tidak ada notifikasi")}
              </p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  n.read
                    ? "bg-background border-border"
                    : "bg-destructive/5 border-destructive/30"
                }`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-destructive inline-block flex-shrink-0" />
                    )}
                    {n.title}
                  </h4>
                  <Badge
                    variant={n.type === "swine_death" ? "destructive" : "secondary"}
                    className="text-[10px] flex-shrink-0"
                  >
                    {n.type === "swine_death"
                      ? t("Swine Loss", "Kematian Babi")
                      : t("General", "Umum")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{new Date(n.created_at).toLocaleDateString()}</p>
                <p className="text-sm leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;
