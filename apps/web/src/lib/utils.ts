import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:__PYON_PORT_API__";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:__PYON_PORT_APP__";
