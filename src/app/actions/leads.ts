"use server";

import { createClient } from "@/lib/supabase/server";

export type LeadFormState = { success: boolean; error?: string };

export async function submitGeneralInquiry(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "Name, email and message are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name,
    email,
    phone: phone || null,
    company: company || null,
    message,
    source: "contact_page",
  });

  if (error) {
    console.error("submitGeneralInquiry insert error:", error);
    return {
      success: false,
      error: "Something went wrong submitting this. Please try WhatsApp or email instead.",
    };
  }

  return { success: true };
}
