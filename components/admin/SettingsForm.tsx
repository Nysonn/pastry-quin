"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import {
  updateEventSettings,
  type SettingsState,
} from "@/app/admin/dashboard/actions";

const inputClass =
  "w-full rounded-xl border border-gold/30 bg-ivory px-4 py-3 font-alt text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

const labelClass =
  "mb-2 block font-alt text-xs font-semibold tracking-widest text-bronze uppercase";

export default function SettingsForm({
  defaults,
}: {
  defaults: {
    eventName: string;
    tagline: string;
    venue: string;
    eventDateLocal: string;
    registrationOpen: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    updateEventSettings,
    { error: null, saved: false }
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="eventName" className={labelClass}>
          Event Name
        </label>
        <input
          id="eventName"
          name="eventName"
          type="text"
          required
          defaultValue={defaults.eventName}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="tagline" className={labelClass}>
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          type="text"
          defaultValue={defaults.tagline}
          className={inputClass}
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eventDate" className={labelClass}>
            Event Date &amp; Time
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="datetime-local"
            required
            defaultValue={defaults.eventDateLocal}
            className={inputClass}
          />
          <p className="mt-1.5 font-alt text-xs text-charcoal/50">
            Drives the countdown on the home page.
          </p>
        </div>
        <div>
          <label htmlFor="venue" className={labelClass}>
            Venue
          </label>
          <input
            id="venue"
            name="venue"
            type="text"
            required
            defaultValue={defaults.venue}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gold/20 bg-cream px-5 py-4">
        <input
          type="checkbox"
          name="registrationOpen"
          defaultChecked={defaults.registrationOpen}
          className="h-4 w-4 accent-[#c9a15c]"
        />
        <span className="font-alt text-sm text-charcoal">
          Registration open — untick to stop accepting new registrations
        </span>
      </label>

      {state.error && (
        <p className="rounded-xl border border-rose-gold/40 bg-rose-gold/10 px-4 py-3 font-alt text-sm text-rose-gold">
          {state.error}
        </p>
      )}
      {state.saved && !state.error && (
        <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 font-alt text-sm text-bronze">
          Settings saved — the public site is updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-alt text-sm font-semibold tracking-widest text-ivory uppercase shadow-warm transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} strokeWidth={1.5} />
        )}
        {pending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
