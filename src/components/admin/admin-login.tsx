"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

export function AdminLogin() {
  const router = useRouter();
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Сеть недоступна. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center px-5 py-16">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(201,168,106,0.12),transparent_55%)]"
      />
      <form
        onSubmit={onSubmit}
        className="glass-panel w-full max-w-md p-8"
      >
        <div className="flex flex-col items-center text-center">
          <Logo className="h-12 w-12" />
          <span className="label-eyebrow mt-5">Админ-панель</span>
          <h1 className="mt-3 font-display text-3xl text-white">
            Lam Capital
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Войдите, чтобы управлять горячими предложениями.
          </p>
        </div>
        <div className="mt-8 space-y-3">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-white/55">
              <User className="h-4 w-4" /> Логин
            </span>
            <Input
              autoFocus
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-white/55">
              <Lock className="h-4 w-4" /> Пароль
            </span>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error && (
          <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Входим…
            </>
          ) : (
            "Войти"
          )}
        </Button>
        <p className="mt-4 text-center text-[11px] text-white/40">
          Учётные данные настраиваются в .env (ADMIN_LOGIN, ADMIN_PASSWORD).
        </p>
      </form>
    </div>
  );
}
