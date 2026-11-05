
import { z } from "zod";

export function sanitizeLine(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeMultiline(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  phone: { min: 7, max: 20 },
  message: { min: 10, max: 2000 },
} as const;

function getTodayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isValidAppointmentDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T12:00:00Z`);

  if (Number.isNaN(date.getTime())) return false;

  // Reject impossible dates such as 2026-02-31.
  if (date.toISOString().slice(0, 10) !== value) return false;

  // Monday = 1. Tuesday–Sunday are allowed.
  if (date.getUTCDay() === 1) return false;

  // Appointments must be requested for today or a future date.
  if (value < getTodayIST()) return false;

  return true;
}

function isValidAppointmentTime(value: string): boolean {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return false;

  const [hours, minutes] = value.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  // 30-minute slots from 10:00 AM through 5:30 PM.
  return (
    totalMinutes >= 10 * 60 &&
    totalMinutes <= 17 * 60 + 30 &&
    minutes % 30 === 0
  );
}

const phonePattern = /^\+?[0-9\s\-().]+$/;

export const contactSchema = z.object({
  name: z
    .string({ error: "Please enter your full name" })
    .trim()
    .min(LIMITS.name.min, "Please enter your full name")
    .max(LIMITS.name.max, `Name must be at most ${LIMITS.name.max} characters`)
    .transform(sanitizeLine)
    .pipe(z.string().min(LIMITS.name.min, "Please enter your full name")),

  email: z
    .string({ error: "Please enter your email address" })
    .trim()
    .max(LIMITS.email.max, "Email address is too long")
    .pipe(z.email("Please enter a valid email address"))
    .transform((value) => value.toLowerCase()),

  phone: z
    .string({ error: "Please enter your phone number" })
    .trim()
    .min(LIMITS.phone.min, "Please enter a valid phone number")
    .max(LIMITS.phone.max, "Please enter a valid phone number")
    .refine(
      (value) => phonePattern.test(value),
      "Use digits only, with an optional + prefix",
    )
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }, "Please enter a valid phone number (10–15 digits)"),

  appointmentDate: z
    .string({ error: "Please select an appointment date" })
    .refine(isValidAppointmentDate, {
      message: "Choose a future date from Tuesday to Sunday. We are closed on Mondays.",
    }),

  appointmentTime: z
    .string({ error: "Please select an appointment time" })
    .refine(isValidAppointmentTime, {
      message: "Choose a time between 10:00 AM and 5:30 PM.",
    }),

  message: z
    .string({ error: "Please write a message" })
    .trim()
    .min(LIMITS.message.min, `Please write at least ${LIMITS.message.min} characters`)
    .max(LIMITS.message.max, `Message must be at most ${LIMITS.message.max} characters`)
    .transform(sanitizeMultiline)
    .pipe(
      z.string().min(
        LIMITS.message.min,
        `Please write at least ${LIMITS.message.min} characters`,
      ),
    ),

  website: z.string().max(200).optional(),
  startedAt: z.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField =
  | "name"
  | "email"
  | "phone"
  | "appointmentDate"
  | "appointmentTime"
  | "message";

export type FieldErrors = Partial<Record<ContactField, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }

  return out;
}
