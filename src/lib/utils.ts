import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  return `Rs. ${new Intl.NumberFormat("en-US").format(safe)}`;
}

export interface PhoneValidationResult {
  valid: boolean;
  normalized: string;
  display: string;
}

/**
 * Validates Pakistani mobile numbers (03XX-XXXXXXX or +92 3XX XXXXXXX)
 * and formats them cleanly for display and persistence.
 */
export function validatePakistaniPhone(raw: string): PhoneValidationResult {
  const digits = raw.replace(/\D/g, "");
  let national = "";

  if (digits.startsWith("92") && digits.length === 12) {
    national = `0${digits.slice(2)}`;
  } else if (digits.startsWith("03") && digits.length === 11) {
    national = digits;
  } else if (digits.startsWith("3") && digits.length === 10) {
    national = `0${digits}`;
  }

  const isValid = /^03\d{9}$/.test(national);
  if (!isValid) {
    return {
      valid: false,
      normalized: digits,
      display: raw.trim(),
    };
  }

  const prefix = national.slice(1, 4);
  const subscriber = national.slice(4);
  return {
    valid: true,
    normalized: `+92${national.slice(1)}`,
    display: `+92 ${prefix} ${subscriber}`,
  };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function generateOrderId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `ZLV-26-${randomDigits}`;
}

export const FREE_DELIVERY_THRESHOLD_PKR = 8000;
export const STANDARD_DELIVERY_FEE_PKR = 350;

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
] as const;

export const ORDER_STAGE_LABELS = [
  "Order Placed",
  "Packed in Matte Box",
  "Dispatched",
  "Delivered",
] as const;
