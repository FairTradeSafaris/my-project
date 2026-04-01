"use client";

import { useEffect, useMemo, useState } from "react";

type SubmissionMode = "crm" | "email";

type BuilderContext = {
  mode: SubmissionMode;
  source: string;
};

type FormData = {
  destination: string;
  experience: string;
  travelTiming: string;
  experienceLevel: string;
  partyType: string;
  fullName: string;
  email: string;
  notes: string;
};

const DESTINATIONS = [
  "South Africa",
  "Kenya",
  "Tanzania",
  "Botswana",
  "Not Sure Yet",
];

const EXPERIENCES = [
  "Luxury Lodge Safari",
  "Golf Safari",
  "Big Five Wildlife",
  "Conservation-Focused",
  "Family Safari",
  "Not Sure Yet",
];

const TRAVEL_TIMING = [
  "Within 3 Months",
  "3–6 Months",
  "6–12 Months",
  "More Than a Year Away",
  "Dates Are Flexible",
];

const EXPERIENCE_LEVELS = ["Premium", "Luxury", "Ultra-Luxury", "Not Sure Yet"];

const PARTY_TYPES = [
  "Couple",
  "Family",
  "Solo Traveller",
  "Friends / Group",
  "Celebration / Special Occasion",
];

export default function SafariBuilderProvider() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [context, setContext] = useState<BuilderContext>({
    mode: "crm",
    source: "default",
  });

  const [formData, setFormData] = useState<FormData>({
    destination: "",
    experience: "",
    travelTiming: "",
    experienceLevel: "",
    partyType: "",
    fullName: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{
        mode?: SubmissionMode;
        source?: string;
      }>;

      setContext({
        mode: customEvent.detail?.mode || "crm",
        source: customEvent.detail?.source || "default",
      });

      setOpen(true);
    };

    window.addEventListener("openSafariBuilder", handleOpen as EventListener);

    return () => {
      window.removeEventListener(
        "openSafariBuilder",
        handleOpen as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const totalSteps = 6;

  const progress = useMemo(() => {
    return `${Math.min(step, totalSteps)}/${totalSteps}`;
  }, [step]);

  const closeBuilder = () => {
    setOpen(false);
  };

  const resetBuilder = () => {
    setStep(1);
    setFormData({
      destination: "",
      experience: "",
      travelTiming: "",
      experienceLevel: "",
      partyType: "",
      fullName: "",
      email: "",
      notes: "",
    });
  };

  const closeAndReset = () => {
    closeBuilder();
    setTimeout(() => {
      resetBuilder();
    }, 300);
  };

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectAndNext = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    updateField(key, value);
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSendRequest = () => {
    const payload = {
      ...formData,
      mode: context.mode,
      source: context.source,
      action: "request",
    };

    console.log("Safari request payload:", payload);
  };

  const handleBookCall = () => {
    const payload = {
      ...formData,
      mode: context.mode,
      source: context.source,
      action: "book_call",
    };

    console.log("Book call payload:", payload);
  };

  const canContinueFromContact =
    formData.fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(formData.email);

  const OptionCard = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left px-6 py-6 rounded-[20px] border border-stone-200 bg-white hover:border-stone-900 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-medium text-stone-900">{label}</span>
        <span className="text-stone-300 group-hover:text-stone-900 transition">
          →
        </span>
      </div>
    </button>
  );

  return (
    <>
      <div
        onClick={closeBuilder}
        className={`fixed inset-0 bg-black/50 backdrop-blur-md z-[90] transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[560px] bg-[#fdfcf9] z-[100] shadow-2xl transform transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-1">
              Plan Your Safari
            </p>
            <h2 className="text-lg font-medium text-stone-900">
              Step {progress}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeAndReset}
            className="text-sm text-stone-400 hover:text-stone-900 transition"
          >
            Close
          </button>
        </div>

        <div className="px-8 py-5 border-b border-stone-200">
          <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-stone-900 transition-all duration-300"
              style={{
                width: `${(Math.min(step, totalSteps) / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="h-[calc(100%-126px)] overflow-y-auto px-8 py-10">
          {step === 1 && (
            <div>
              <div className="mb-10">
                <h3 className="text-3xl font-semibold tracking-tight text-stone-900 mb-3">
                  Where would you love to go?
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  Choose a destination to begin shaping your journey. You can
                  refine everything with us later.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {DESTINATIONS.map((destination) => (
                  <OptionCard
                    key={destination}
                    label={destination}
                    onClick={() => selectAndNext("destination", destination)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-stone-500 hover:text-stone-900 mb-5"
                >
                  ← Back
                </button>

                <h3 className="text-3xl font-semibold tracking-tight text-stone-900 mb-3">
                  What kind of experience are you looking for?
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  Pick the safari style that best matches what you’re dreaming
                  of.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {EXPERIENCES.map((experience) => (
                  <OptionCard
                    key={experience}
                    label={experience}
                    onClick={() => selectAndNext("experience", experience)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-stone-500 hover:text-stone-900 mb-5"
                >
                  ← Back
                </button>

                <h3 className="text-3xl font-semibold tracking-tight text-stone-900 mb-3">
                  When would you love to travel?
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  A rough idea is enough for now. We can help fine-tune the
                  timing later.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {TRAVEL_TIMING.map((timing) => (
                  <OptionCard
                    key={timing}
                    label={timing}
                    onClick={() => selectAndNext("travelTiming", timing)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="mb-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-stone-500 hover:text-stone-900 mb-5"
                >
                  ← Back
                </button>

                <h3 className="text-3xl font-semibold tracking-tight text-stone-900 mb-3">
                  What level of experience are you looking for?
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  This helps us shape the right lodges, pace, and overall style
                  of journey.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {EXPERIENCE_LEVELS.map((level) => (
                  <OptionCard
                    key={level}
                    label={level}
                    onClick={() => selectAndNext("experienceLevel", level)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="mb-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-stone-500 hover:text-stone-900 mb-5"
                >
                  ← Back
                </button>

                <h3 className="text-3xl font-semibold tracking-tight text-stone-900 mb-3">
                  Who is travelling?
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  We’ll use this to shape the right rhythm, lodging, and
                  experience.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {PARTY_TYPES.map((partyType) => (
                  <OptionCard
                    key={partyType}
                    label={partyType}
                    onClick={() => selectAndNext("partyType", partyType)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <div className="mb-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-stone-500 hover:text-stone-900 mb-5"
                >
                  ← Back
                </button>

                <h3 className="text-3xl font-semibold tracking-tight text-stone-900 mb-3">
                  Where can we send your safari ideas?
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  Share your details and anything else you’d like us to know.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-4 text-stone-900 outline-none focus:border-stone-900"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-4 text-stone-900 outline-none focus:border-stone-900"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Anything else you’d like us to know?
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-4 text-stone-900 outline-none focus:border-stone-900 resize-none"
                    placeholder="Tell us about special interests, celebrations, golf, conservation, preferred style, or anything else."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(7)}
                  disabled={!canContinueFromContact}
                  className="w-full rounded-full bg-stone-900 text-white px-6 py-4 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <div className="mb-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm text-stone-500 hover:text-stone-900 mb-5"
                >
                  ← Back
                </button>

                <h3 className="text-3xl font-semibold tracking-tight text-stone-900 mb-3">
                  How would you like to continue?
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  We can either start shaping your options by email, or help you
                  take the next step with a discovery call.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="rounded-[20px] border border-stone-200 bg-white p-5">
                  <p className="text-sm text-stone-500 mb-2">Destination</p>
                  <p className="font-medium text-stone-900">
                    {formData.destination}
                  </p>
                </div>

                <div className="rounded-[20px] border border-stone-200 bg-white p-5">
                  <p className="text-sm text-stone-500 mb-2">Experience</p>
                  <p className="font-medium text-stone-900">
                    {formData.experience}
                  </p>
                </div>

                <div className="rounded-[20px] border border-stone-200 bg-white p-5">
                  <p className="text-sm text-stone-500 mb-2">Timing</p>
                  <p className="font-medium text-stone-900">
                    {formData.travelTiming}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleSendRequest}
                  className="w-full rounded-[20px] border border-stone-900 bg-stone-900 text-white px-6 py-5 text-left hover:opacity-95 transition"
                >
                  <span className="block text-lg font-medium mb-1">
                    Send me tailored safari ideas
                  </span>
                  <span className="block text-sm text-white/75">
                    Best for travellers who want us to follow up by{" "}
                    {context.mode === "email" ? "email" : "our planning team"}.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleBookCall}
                  className="w-full rounded-[20px] border border-stone-300 bg-white text-stone-900 px-6 py-5 text-left hover:border-stone-900 transition"
                >
                  <span className="block text-lg font-medium mb-1">
                    Book a discovery call
                  </span>
                  <span className="block text-sm text-stone-500">
                    Ideal if you’d like to speak with us and shape your safari
                    together.
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
