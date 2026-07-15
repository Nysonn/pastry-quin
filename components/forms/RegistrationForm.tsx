"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  GUEST_TYPES,
  registrationSchema,
  type RegistrationInput,
} from "@/lib/validation/registration";
import { errorClass, inputClass, labelClass } from "./field-styles";

export default function RegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { numberOfGuests: 1 },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/register/success");
      return;
    }
    const body = await res.json().catch(() => null);
    setServerError(
      body?.error ??
        "Something went wrong saving your registration — please try again."
    );
  });

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

      <div className="grid gap-6 sm:grid-cols-2">
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
          <label htmlFor="guestType" className={labelClass}>
            I am a... *
          </label>
          <select
            id="guestType"
            className={inputClass}
            defaultValue=""
            {...register("guestType")}
          >
            <option value="" disabled>
              Choose the best fit
            </option>
            {GUEST_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.guestType && (
            <p className={errorClass}>{errors.guestType.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="numberOfGuests" className={labelClass}>
            Number of Guests *
          </label>
          <input
            id="numberOfGuests"
            type="number"
            min={1}
            max={10}
            className={inputClass}
            {...register("numberOfGuests")}
          />
          {errors.numberOfGuests && (
            <p className={errorClass}>{errors.numberOfGuests.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="hearAboutUs" className={labelClass}>
            How did you hear about us?
          </label>
          <input
            id="hearAboutUs"
            type="text"
            placeholder="Instagram, a friend, ..."
            className={inputClass}
            {...register("hearAboutUs")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Anything we should know?
        </label>
        <textarea
          id="notes"
          rows={4}
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
        className="shimmer-sweep inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {isSubmitting ? "Registering..." : "Register Now"}
      </button>
    </form>
  );
}
