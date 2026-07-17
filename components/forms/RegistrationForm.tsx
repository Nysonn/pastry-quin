"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { registrationSchema, type RegistrationInput } from "@/lib/validation/registration";
import { errorClass, inputClass, labelClass } from "./field-styles";

export default function RegistrationForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setConfirmed(true);
      return;
    }
    const body = await res.json().catch(() => null);
    setServerError(
      body?.error ?? "Something went wrong saving your RSVP — please try again."
    );
  });

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-10 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ivory shadow-warm-lg"
        >
          <Check size={28} strokeWidth={2} />
        </motion.span>
        <h3 className="mt-6 font-display text-3xl text-charcoal">
          You&apos;re on the list
        </h3>
        <p className="mt-3 font-serif-alt text-lg text-charcoal/70 italic">
          Your seat at the runway is reserved. We&apos;ll be in touch closer to
          the date.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={inputClass}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className={errorClass}>{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register("email")}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+256 ..."
          className={inputClass}
          {...register("phone")}
        />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Anything we should know?
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Dietary needs, accessibility, special occasions..."
          className={inputClass}
          {...register("notes")}
        />
        {errors.notes && <p className={errorClass}>{errors.notes.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-xl border border-rose-gold/40 bg-rose-gold/10 px-4 py-3 font-alt text-sm text-rose-gold">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="shimmer-sweep inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {isSubmitting ? "Reserving..." : "RSVP"}
      </button>
    </form>
  );
}
