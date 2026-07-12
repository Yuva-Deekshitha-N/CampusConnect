import { formatDate } from "@/lib/utils";
import { FormEvent, useState } from "react";
import { X } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  banner_url?: string | null;
  clubs: { name: string } | { name: string }[] | null;
  event_rsvps: { id: string; user_id: string }[] | null;
}

interface EventCardProps {
  event: Event;
  index: number;
  user: { id: string } | null;
  onRsvpToggle: (eventId: string, hasRsvpd: boolean) => void;
  isRsvpPending: boolean;
}

export function EventCard({ event, index, user, onRsvpToggle, isRsvpPending }: EventCardProps) {
  const club = Array.isArray(event.clubs) ? event.clubs[0] : event.clubs;
  const rsvps = Array.isArray(event.event_rsvps) ? event.event_rsvps : [];
  const hasRsvpd = user ? rsvps.some((rsvp) => rsvp.user_id === user.id) : false;
  const colors = ["bg-lime", "bg-sky", "bg-peach", "bg-lavender"];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");

  const resetForm = () => {
    setStudentId("");
    setDietaryPreference("");
    setIsFormOpen(false);
  };

  const handleRsvpClick = () => {
    if (!user) {
      window.alert("Please log in to RSVP");
      return;
    }

    if (hasRsvpd) {
      onRsvpToggle(event.id, true);
      return;
    }

    setIsFormOpen(true);
  };

  const handleSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    const form = formEvent.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    onRsvpToggle(event.id, false);
    resetForm();
  };

  return (
    <article className="group neu-border flex flex-col bg-white p-5 transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[8px_8px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000000]">
      <div className="mb-4 overflow-hidden border-2 border-black">
        <img
          src={event.banner_url || "/images/placeholder.png"}
          alt={event.title}
          className="h-40 w-full object-cover"
        />
      </div>

      <div className="mb-4 flex items-start justify-between">
        <div
          className={`neu-border ${colors[index % colors.length]} px-4 py-3 text-center font-mono text-xs font-bold transition-transform duration-300 group-hover:scale-105`}
        >
          {event.event_date ? formatDate(event.event_date).split(" at ")[0].toUpperCase() : "TBA"}
        </div>
        <span className="neu-border bg-cream px-2 py-1 font-mono text-[10px] font-bold uppercase transition-transform duration-300 group-hover:scale-105">
          Event
        </span>
      </div>

      <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-black/80">
        {event.title}
      </h2>
      <p className="mt-1 font-mono text-xs">{club?.name}</p>

      {event.description ? (
        <p className="mt-3 text-sm leading-6">{event.description}</p>
      ) : null}

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="font-mono text-xs font-bold uppercase">Date &amp; Time</dt>
          <dd className="mt-1 text-sm">{event.event_date ? formatDate(event.event_date) : "TBA"}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs font-bold uppercase">Venue</dt>
          <dd className="mt-1 text-sm">{event.location || "TBA"}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs font-bold uppercase">Attendees</dt>
          <dd className="mt-1 text-sm">{rsvps.length} RSVP&apos;d</dd>
        </div>
      </dl>

      <div className="my-4 border-t-2 border-black" />

      {isFormOpen && !hasRsvpd ? (
        <form className="neu-border bg-cream p-4" onSubmit={handleSubmit} noValidate={false}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-black">Complete your RSVP</h3>
              <p className="mt-1 text-sm">Required fields must be completed before submitting.</p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="neu-border grid h-9 w-9 shrink-0 place-items-center bg-white"
              aria-label="Close RSVP form"
            >
              <X aria-hidden="true" size={18} strokeWidth={3} />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-xs font-bold uppercase">
                Student ID <span aria-hidden="true">*</span>
              </span>
              <input
                type="text"
                name="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                autoComplete="off"
                className="neu-border mt-2 w-full bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your student ID"
              />
            </label>

            <label className="block">
              <span className="font-mono text-xs font-bold uppercase">
                Dietary preference <span aria-hidden="true">*</span>
              </span>
              <select
                name="dietaryPreference"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                required
                className="neu-border mt-2 w-full bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="none">No preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="halal">Halal</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isRsvpPending}
              className="neu-border bg-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-cream disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRsvpPending ? "Submitting..." : "Confirm RSVP"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="neu-border bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {!isFormOpen || hasRsvpd ? (
        <button
          type="button"
          onClick={handleRsvpClick}
          disabled={isRsvpPending}
          className={`neu-border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
            hasRsvpd ? "bg-lime text-black" : "bg-black text-cream"
          }`}
        >
          {isRsvpPending ? "Updating..." : hasRsvpd ? "RSVP'd ✓" : "RSVP →"}
        </button>
      ) : null}
    </article>
  );
}
