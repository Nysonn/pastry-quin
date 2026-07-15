"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  VENDOR_CATEGORIES,
  vendorSchema,
  type VendorInput,
} from "@/lib/validation/vendor";
import { errorClass, inputClass, labelClass } from "./field-styles";

export default function VendorApplicationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorInput>({
    resolver: zodResolver(vendorSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/vendors/apply/success");
      return;
    }
    const body = await res.json().catch(() => null);
    setServerError(
      body?.error ??
        "Something went wrong sending your application — please try again."
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="businessName" className={labelClass}>
            Business Name *
          </label>
          <input
            id="businessName"
            type="text"
            autoComplete="organization"
            placeholder="Your brand or studio"
            className={inputClass}
            {...register("businessName")}
          />
          {errors.businessName && (
            <p className={errorClass}>{errors.businessName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contactName" className={labelClass}>
            Contact Person *
          </label>
          <input
            id="contactName"
            type="text"
            autoComplete="name"
            placeholder="Who should we speak to?"
            className={inputClass}
            {...register("contactName")}
          />
          {errors.contactName && (
            <p className={errorClass}>{errors.contactName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="vendorEmail" className={labelClass}>
            Email *
          </label>
          <input
            id="vendorEmail"
            type="email"
            autoComplete="email"
            placeholder="you@brand.com"
            className={inputClass}
            {...register("email")}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="vendorPhone" className={labelClass}>
            Phone
          </label>
          <input
            id="vendorPhone"
            type="tel"
            autoComplete="tel"
            placeholder="+256 ..."
            className={inputClass}
            {...register("phone")}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="vendorCategory" className={labelClass}>
            Vendor Category *
          </label>
          <select
            id="vendorCategory"
            className={inputClass}
            defaultValue=""
            {...register("vendorCategory")}
          >
            <option value="" disabled>
              Choose your category
            </option>
            {VENDOR_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.vendorCategory && (
            <p className={errorClass}>{errors.vendorCategory.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="websiteOrInstagram" className={labelClass}>
            Website or Instagram
          </label>
          <input
            id="websiteOrInstagram"
            type="text"
            placeholder="https://... or @handle"
            className={inputClass}
            {...register("websiteOrInstagram")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Tell us about your work
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="What would you bring to Cake Runway?"
          className={inputClass}
          {...register("message")}
        />
        {errors.message && (
          <p className={errorClass}>{errors.message.message}</p>
        )}
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
        {isSubmitting ? "Sending Application..." : "Apply as a Vendor"}
      </button>
    </form>
  );
}
