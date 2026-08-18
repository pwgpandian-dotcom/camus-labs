"use server";

import { createClient } from "@/lib/supabase/server";

export type ProjectRequestState = {
  success: boolean;
  error?: string;
  referenceNumber?: string;
};

export async function submitProjectRequest(
  _prevState: ProjectRequestState,
  formData: FormData
): Promise<ProjectRequestState> {
  const build_type = String(formData.get("build_type") || "").trim();
  const idea_description = String(formData.get("idea_description") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  const timeline = String(formData.get("timeline") || "").trim();
  const budget_range = String(formData.get("budget_range") || "").trim();
  const contact_name = String(formData.get("contact_name") || "").trim();
  const contact_email = String(formData.get("contact_email") || "").trim();
  const contact_phone = String(formData.get("contact_phone") || "").trim();
  const wants_consultation = formData.get("wants_consultation") === "on";

  if (!build_type || !idea_description || !contact_name || !contact_email) {
    return {
      success: false,
      error: "What you're building, a short description, your name and email are required.",
    };
  }

  const supabase = await createClient();

  // Every submission also becomes a lead, so it shows up in the Leads inbox
  // too — useful for staff triaging both surfaces from one place.
  const { data: lead } = await supabase
    .from("leads")
    .insert({
      name: contact_name,
      email: contact_email,
      phone: contact_phone || null,
      message: idea_description,
      source: "start_project",
    })
    .select("id")
    .single();

  const { data, error } = await supabase
    .from("project_requests")
    .insert({
      lead_id: lead?.id ?? null,
      build_type,
      idea_description,
      industry: industry || null,
      timeline: timeline || null,
      budget_range: budget_range || null,
      contact_name,
      contact_email,
      contact_phone: contact_phone || null,
      wants_consultation,
    })
    .select("reference_number")
    .single();

  if (error || !data) {
    console.error("submitProjectRequest insert error:", error);
    return {
      success: false,
      error: "Something went wrong submitting this. Please try WhatsApp or email instead.",
    };
  }

  return { success: true, referenceNumber: data.reference_number };
}
