import SettingsForm from "@/components/admin/SettingsForm";
import { getEventSettings } from "@/lib/db/queries";

export default async function SettingsPage() {
  const settings = await getEventSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-charcoal">Event Settings</h1>
      <p className="mt-1 font-alt text-sm text-charcoal/60">
        These values power the public site — the countdown, venue text and
        whether the registration form accepts submissions.
      </p>
      <div className="mt-8 rounded-2xl border border-gold/20 bg-ivory p-8 shadow-warm">
        <SettingsForm
          defaults={{
            eventName: settings.eventName,
            tagline: settings.tagline,
            venue: settings.venue,
            eventDateLocal: toDatetimeLocal(settings.eventDate),
            registrationOpen: settings.registrationOpen,
          }}
        />
      </div>
    </div>
  );
}

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
