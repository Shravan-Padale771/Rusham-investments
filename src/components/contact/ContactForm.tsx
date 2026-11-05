
"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronDown, Loader2, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  LIMITS,
  contactSchema,
  toFieldErrors,
  type ContactField,
  type FieldErrors,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

interface Values {
  name: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  message: string;
  website: string;
}


const empty: Values = {
  name: "",
  email: "",
  phone: "",
  appointmentDate: "",
  appointmentTime: "",
  message: "",
  website: "",
};

const timeSlots = Array.from({ length: 16 }, (_, index) => {
  const totalMinutes = 10 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

function getToday(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return parts;
}

function formatDate(date: string): string {
  if (!date) return "";

  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string): string {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ContactForm() {
  const uid = useId();

  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const startedAt = useRef(0);
  const [submittedValues, setSubmittedValues] = useState<Values>(empty);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const validate = (value: Values): FieldErrors => {
    const result = contactSchema.safeParse({
      ...value,
      startedAt: undefined,
    });

    return result.success ? {} : toFieldErrors(result.error);
  };

  const update = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    const next = {
      ...values,
      [name]: value,
    };

    setValues(next);

    if (errors[name as ContactField]) {
      const fresh = validate(next);
      setErrors((previous) => ({
        ...previous,
        [name]: fresh[name as ContactField],
      }));
    }
  };

  const blur = (field: ContactField) => {
    if (!values[field]) return;

    const fresh = validate(values);

    setErrors((previous) => ({
      ...previous,
      [field]: fresh[field],
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "submitting") return;

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus("idle");
      const first = Object.keys(found)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          startedAt: startedAt.current,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: FieldErrors;
      };

      if (response.ok && data.ok) {
        setSubmittedValues(values);
        setStatus("success");
        setValues(empty);
        return;
      }

      if (data.errors) setErrors(data.errors);

      setServerMessage(
        data.message ?? "Something went wrong. Please try again.",
      );
      setStatus("error");
    } catch {
      setServerMessage(
        "We couldn't reach the server. Please check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const fieldProps = (field: ContactField) => ({
    id: `${uid}-${field}`,
    name: field,
    "aria-invalid": errors[field] ? (true as const) : undefined,
    "aria-describedby": errors[field] ? `${uid}-${field}-error` : undefined,
    onChange: update,
    onBlur: () => blur(field),
  });

  const fieldError = (field: ContactField) =>
    errors[field] ? (
      <p
        id={`${uid}-${field}-error`}
        role="alert"
        className="mt-1.5 flex items-center gap-1.5 text-sm text-[#b3261e]"
      >
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {errors[field]}
      </p>
    ) : null;

  const labelClass = "label-sub mb-2 block text-sm";

  return (
    <div className="relative rounded-[2rem] border border-border bg-background p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-[28rem] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-dark">
              <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
            </span>

            <h2 className="display-md mt-8">
              Your appointment request is received.
            </h2>

            <p className="lead mt-4 max-w-md text-foreground/80">
              Thank you for choosing Rusham Investment. Our team will review
              your preferred date and time and contact you to confirm your
              appointment.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-soft/10 p-4 text-sm">
              <p>
                <strong>Preferred date:</strong>{" "}
                {formatDate(values.appointmentDate) || "Submitted"}
              </p>
              <p className="mt-1">
                <strong>Preferred time:</strong>{" "}
                {formatTime(values.appointmentTime) || "Submitted"}
              </p>
              <p className="mt-3 text-soft">
                Please wait for our confirmation before visiting our office.
              </p>
            </div>

            <div className="mt-8">
              <Button
                variant="secondary"
                arrow={false}
                onClick={() => {
                  setStatus("idle");
                  startedAt.current = Date.now();
                }}
              >
                Request another appointment
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-busy={status === "submitting"}
          >
            <div className="mb-8">
              <p className="eyebrow text-soft">Schedule a meeting</p>
              <h2 className="display-md mt-3">Book an Appointment</h2>
              <p className="mt-3 text-sm text-foreground/70">
                Choose your preferred date and time. Our team will contact you
                to confirm your appointment.
              </p>
            </div>

            {/* Office hours */}
            <div className="mb-8 rounded-2xl border border-border bg-soft/10 p-5">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="label-sub text-sm">Office Hours</h3>
              </div>

              <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    Tuesday – Sunday
                  </p>
                  <p className="mt-0.5 text-soft">10:00 AM – 6:00 PM</p>
                </div>

                <div className="sm:text-right">
                  <p className="font-semibold text-foreground">Monday</p>
                  <p className="mt-0.5 text-[#b3261e]">Closed</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Appointment date */}
              <div>
                <label
                  htmlFor={`${uid}-appointmentDate`}
                  className={labelClass}
                >
                  Appointment Date
                </label>

                <div className="relative">
                  <input
                    {...fieldProps("appointmentDate")}
                    type="date"
                    min={getToday()}
                    value={values.appointmentDate}
                    className="form-field pr-11"
                  />
                  <CalendarDays
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-soft"
                    aria-hidden="true"
                  />
                </div>

                {fieldError("appointmentDate")}
                <p className="mt-1.5 text-xs text-soft">
                  Monday appointments are unavailable.
                </p>
              </div>

              {/* Appointment time */}
              <div>
                <label
                  htmlFor={`${uid}-appointmentTime`}
                  className={labelClass}
                >
                  Preferred Time
                </label>

                <div className="relative">
                  <select
                    {...fieldProps("appointmentTime")}
                    value={values.appointmentTime}
                    className="form-field appearance-none pr-11"
                  >
                    <option value="" disabled>
                      Select a time
                    </option>

                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-soft"
                    aria-hidden="true"
                  />
                </div>

                {fieldError("appointmentTime")}
                <p className="mt-1.5 text-xs text-soft">
                  Available slots: 10:00 AM – 5:30 PM.
                </p>
              </div>

              {/* Name */}
              <div>
                <label htmlFor={`${uid}-name`} className={labelClass}>
                  Full Name
                </label>
                <input
                  {...fieldProps("name")}
                  type="text"
                  autoComplete="name"
                  maxLength={LIMITS.name.max}
                  value={values.name}
                  placeholder="Your full name"
                  className="form-field"
                />
                {fieldError("name")}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor={`${uid}-phone`} className={labelClass}>
                  Contact Number
                </label>
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={LIMITS.phone.max}
                  value={values.phone}
                  placeholder="+91 98765 43210"
                  className="form-field"
                />
                {fieldError("phone")}
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-email`} className={labelClass}>
                  Email Address
                </label>
                <input
                  {...fieldProps("email")}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={LIMITS.email.max}
                  value={values.email}
                  placeholder="you@example.com"
                  className="form-field"
                />
                {fieldError("email")}
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-message`} className={labelClass}>
                  Message
                </label>
                <textarea
                  {...fieldProps("message")}
                  rows={5}
                  maxLength={LIMITS.message.max}
                  value={values.message}
                  placeholder="Tell us what you would like to discuss..."
                  className="form-field resize-y"
                />

                <div className="mt-1.5 flex justify-between gap-4">
                  <div>{fieldError("message")}</div>
                  <p className="ml-auto text-xs text-soft">
                    {values.message.length}/{LIMITS.message.max}
                  </p>
                </div>
              </div>

              {/* Honeypot */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor={`${uid}-website`}>Website</label>
                <input
                  id={`${uid}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={update}
                />
              </div>
            </div>

            <div aria-live="polite" className="mt-6">
              {status === "error" && serverMessage && (
                <p
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-[#b3261e]/40 bg-[#b3261e]/5 p-4 text-sm text-[#8c1d18]"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {serverMessage}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                disabled={status === "submitting"}
                arrow={status !== "submitting"}
              >
                {status === "submitting" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Sending Request...
                  </span>
                ) : (
                  "Request Appointment"
                )}
              </Button>

              <p className="max-w-xs text-xs text-soft">
                Your appointment is subject to confirmation by our team.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
