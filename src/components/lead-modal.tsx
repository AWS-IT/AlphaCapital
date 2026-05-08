"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, Phone, User, Mail, MessageSquare } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { isValidRussianPhone, maskRussianPhone } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type LeadOptions = {
  source?: string;
  objectId?: number;
  objectTitle?: string;
  title?: string;
  description?: string;
};

type LeadContextValue = {
  open: (options?: LeadOptions) => void;
};

const LeadModalContext = React.createContext<LeadContextValue | null>(null);

export function useLeadModal() {
  const ctx = React.useContext(LeadModalContext);
  if (!ctx)
    throw new Error("useLeadModal must be used within LeadModalProvider");
  return ctx;
}

type State = "idle" | "submitting" | "success" | "error";

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<LeadOptions>({});
  const [state, setState] = React.useState<State>("idle");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { toast } = useToast();

  const open = React.useCallback((opts: LeadOptions = {}) => {
    setOptions(opts);
    setState("idle");
    setErrors({});
    setIsOpen(true);
  }, []);

  const reset = React.useCallback(() => {
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setErrors({});
    setState("idle");
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => {
      reset();
    }, 250);
  }, [reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "submitting") return;

    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Введите имя";
    if (!isValidRussianPhone(phone))
      nextErrors.phone = "Укажите телефон в формате +7";
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Неверный формат email";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setState("submitting");
    try {
      const payload = {
        name: name.trim(),
        phone,
        email: email.trim() || "",
        message: message.trim() || "",
        source: options.source || "site",
        objectId: options.objectId ?? "",
        objectTitle: options.objectTitle ?? "",
        page: typeof window !== "undefined" ? window.location.href : "",
        sentAt: new Date().toISOString(),
      };

      // Google Apps Script: text/plain avoids CORS preflight; the script reads
      // the body via e.postData.contents. We don't read the response (no-cors).
      await fetch(siteConfig.leadsWebhook, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      setState("success");
      toast({
        variant: "success",
        title: "Заявка принята",
        description: "Менеджер свяжется с вами в ближайшее время.",
      });
    } catch (err) {
      console.error(err);
      setState("error");
      toast({
        variant: "error",
        title: "Не удалось отправить",
        description: "Попробуйте ещё раз или позвоните нам напрямую.",
      });
    }
  };

  return (
    <LeadModalContext.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(v) => (v ? setIsOpen(true) : close())}>
        <DialogContent
          className="max-h-[92vh] overflow-y-auto p-0"
          onOpenAutoFocus={(e) => {
            // Prevent Radix from focusing the first input — keeps the
            // smooth fade-in and avoids mobile keyboard popping immediately.
            e.preventDefault();
          }}
        >
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(201,168,106,0.18),transparent_60%)]"
            />
            <div className="relative px-7 pb-2 pt-7">
              <DialogHeader>
                <span className="label-eyebrow">
                  {options.source === "viewing"
                    ? "Запись на просмотр"
                    : "Оставить заявку"}
                </span>
                <DialogTitle>
                  {options.title ?? "Свяжемся за 5 минут"}
                </DialogTitle>
                <DialogDescription>
                  {options.description ??
                    "Оставьте контакты — персональный менеджер подберёт варианты, отвечающие именно вашим целям."}
                </DialogDescription>
                {options.objectTitle && (
                  <div className="mt-3 inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    Объект: {options.objectTitle}
                  </div>
                )}
              </DialogHeader>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {state === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="px-7 pb-7 pt-2"
                  >
                    <div className="grid place-items-center gap-4 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-8 text-center">
                      <div className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/15">
                        <Check className="h-7 w-7 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl text-white">
                          Спасибо!
                        </h3>
                        <p className="mt-1 text-sm text-white/65">
                          Заявка отправлена. Менеджер позвонит вам в течение 15 минут.
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={close} className="mt-2">
                        Закрыть
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-3 px-7 pb-7 pt-3"
                    >
                      <Field
                        label="Имя"
                        icon={<User className="h-4 w-4" />}
                        error={errors.name}
                      >
                        <Input
                          name="name"
                          placeholder="Как к вам обращаться"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                        />
                      </Field>
                      <Field
                        label="Телефон"
                        icon={<Phone className="h-4 w-4" />}
                        error={errors.phone}
                      >
                        <Input
                          name="phone"
                          placeholder="+7 (___) ___-__-__"
                          inputMode="tel"
                          value={phone}
                          autoComplete="tel"
                          onChange={(e) =>
                            setPhone(maskRussianPhone(e.target.value))
                          }
                          onFocus={() => {
                            if (!phone) setPhone("+7 (");
                          }}
                        />
                      </Field>
                      <Field
                        label="Email (по желанию)"
                        icon={<Mail className="h-4 w-4" />}
                        error={errors.email}
                      >
                        <Input
                          name="email"
                          type="email"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </Field>
                      <Field
                        label="Сообщение (по желанию)"
                        icon={<MessageSquare className="h-4 w-4" />}
                      >
                        <Textarea
                          name="message"
                          placeholder="Кратко расскажите о пожеланиях"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                        />
                      </Field>
                      <Button
                        type="submit"
                        size="lg"
                        className="mt-2 w-full"
                        disabled={state === "submitting"}
                      >
                        {state === "submitting" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Отправляем…
                          </>
                        ) : (
                          "Оставить заявку"
                        )}
                      </Button>
                      <p className="pt-1 text-center text-[11px] leading-relaxed text-white/45">
                        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </LeadModalContext.Provider>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-white/55">
        {icon}
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-[12px] text-destructive">{error}</span>
      )}
    </label>
  );
}
