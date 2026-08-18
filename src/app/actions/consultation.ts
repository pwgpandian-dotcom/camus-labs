"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type ConsultationFormState = { success: boolean; error?: string };

export async function submitConsultation(
  _prevState: ConsultationFormState,
  formData: FormData
): Promise<ConsultationFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const type = String(formData.get("type") || "discovery") as Database["public"]["Enums"]["consultation_type"];
  const preferredDate = String(formData.get("preferred_date") || "").trim();
  const preferredTime = String(formData.get("preferred_time") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!name || !email || !preferredDate || !preferredTime) {
    return { success: false, error: "Name, email, and a preferred date/time are required." };
  }

  const scheduledAt = new Date(`${preferredDate}T${preferredTime}`);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { success: false, error: "That date/time isn't valid." };
  }

  const supabase = await createClient();

  // Every consultation request also becomes a lead, same pattern as the
  // Start Your Project flow — keeps staff triage in one inbox.
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      message: notes || `Consultation request (${type}).`,
      source: "consultation",
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    console.error("submitConsultation lead insert error:", leadError);
    return {
      success: false,
      error: "Something went wrong submitting this. Please try WhatsApp or email instead.",
    };
  }

  const { error: consultError } = await supabase.from("consultations").insert({
    lead_id: lead.id,
    client_id: null,
    type,
    scheduled_at: scheduledAt.toISOString(),
    notes: notes || null,
  });

  if (consultError) {
    console.error("submitConsultation insert error:", consultError);
    return {
      success: false,
      error: "Something went wrong submitting this. Please try WhatsApp or email instead.",
    };
  }

  return { success: true };
}
