"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login, type LoginState } from "./actions";

const inputClass =
  "w-full rounded-xl border border-gold/30 bg-ivory px-4 py-3 font-alt text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

const labelClass =
  "mb-2 block font-alt text-xs font-semibold tracking-widest text-bronze uppercase";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    { error: null }
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gold/20 bg-ivory p-10 shadow-warm-lg">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-champagne font-display text-xl text-bronze">
              PQ
            </span>
            <h1 className="mt-6 font-display text-2xl text-charcoal">
              Admin Sign In
            </h1>
            <p className="mt-2 font-serif-alt text-sm text-charcoal/60 italic">
              Pastry Quin Cake Runway
            </p>
          </div>

          <form action={formAction} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@pastryquin.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {state.error && (
              <p className="rounded-xl border border-rose-gold/40 bg-rose-gold/10 px-4 py-3 font-alt text-sm text-rose-gold">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm transition-all duration-300 hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={16} strokeWidth={1.5} />
              )}
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center font-alt text-xs text-charcoal/50">
          Organizer access only. Guests don&apos;t need an account.
        </p>
      </div>
    </div>
  );
}
