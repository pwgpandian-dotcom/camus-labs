"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ActionState = { success: boolean; error?: string };

// ---------------------------------------------------------------
// Team & Roles
// ---------------------------------------------------------------
export async function updateUserRole(
  userId: string,
  role: Database["public"]["Enums"]["user_role"]
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);

  if (error) {
    // The DB trigger raises here if the caller isn't really an admin —
    // surfaced as a friendly message instead of a raw Postgres error.
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/team");
  return { success: true };
}

// ---------------------------------------------------------------
// Consultations
// ---------------------------------------------------------------
export async function updateConsultationStatus(
  id: string,
  status: Database["public"]["Enums"]["consultation_status"]
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("consultations").update({ status }).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/consultations");
  return { success: true };
}

// ---------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------
export async function upsertCaseStudy(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const project_name = String(formData.get("project_name") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  const problem = String(formData.get("problem") || "").trim();
  const solution = String(formData.get("solution") || "").trim();
  const results = String(formData.get("results") || "").trim();
  const live_demo_url = String(formData.get("live_demo_url") || "").trim();
  const featuresRaw = String(formData.get("features") || "").trim();
  const technologyRaw = String(formData.get("technology") || "").trim();
  const is_published = formData.get("is_published") === "on";

  if (!slug || !project_name) {
    return { success: false, error: "Slug and project name are required." };
  }

  const features = featuresRaw
    ? featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];
  const technology = technologyRaw
    ? technologyRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const supabase = await createClient();
  const payload = {
    slug,
    project_name,
    industry: industry || null,
    problem: problem || null,
    solution: solution || null,
    results: results || null,
    live_demo_url: live_demo_url || null,
    features,
    technology,
    is_published,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("case_studies").update(payload).eq("id", id)
    : await supabase.from("case_studies").insert(payload);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/case-studies");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  return { success: true };
}

export async function deleteCaseStudy(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  revalidatePath("/projects");
  return { success: true };
}

// ---------------------------------------------------------------
// Documents (Supabase Storage)
// ---------------------------------------------------------------
export async function uploadDocument(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "other") as Database["public"]["Enums"]["document_category"];
  const clientId = String(formData.get("client_id") || "").trim() || null;
  const file = formData.get("file") as File | null;

  if (!title || !file || file.size === 0) {
    return { success: false, error: "Title and a file are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in." };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${clientId || "general"}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: file.type || "application/octet-stream" });

  if (uploadError) return { success: false, error: uploadError.message };

  const { error: insertError } = await supabase.from("documents").insert({
    title,
    category,
    client_id: clientId,
    file_url: path,
    uploaded_by: user.id,
  });

  if (insertError) return { success: false, error: insertError.message };

  revalidatePath("/admin/documents");
  return { success: true };
}

export async function getDocumentSignedUrl(path: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(path, 60 * 10); // 10 minutes
  if (error) return null;
  return data.signedUrl;
}

// ---------------------------------------------------------------
// Payments
// ---------------------------------------------------------------
export async function createPayment(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const client_id = String(formData.get("client_id") || "").trim();
  const project_id = String(formData.get("project_id") || "").trim();
  const invoice_number = String(formData.get("invoice_number") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  const currency = String(formData.get("currency") || "INR").trim();
  const due_date = String(formData.get("due_date") || "").trim();

  if (!client_id || !project_id || !invoice_number || !amount) {
    return { success: false, error: "Client, project, invoice number and amount are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    client_id,
    project_id,
    invoice_number,
    amount,
    currency,
    due_date: due_date || null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function updatePaymentStatus(
  id: string,
  status: Database["public"]["Enums"]["payment_status"]
): Promise<ActionState> {
  const supabase = await createClient();
  const paid_at = status === "paid" ? new Date().toISOString() : null;
  const { error } = await supabase.from("payments").update({ status, paid_at }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/payments");
  return { success: true };
}

// ---------------------------------------------------------------
// Messages
// ---------------------------------------------------------------
export async function sendStaffReply(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const thread_id = String(formData.get("thread_id") || "").trim();
  const recipient_id = String(formData.get("recipient_id") || "").trim() || null;
  const project_id = String(formData.get("project_id") || "").trim() || null;
  const body = String(formData.get("body") || "").trim();

  if (!body) return { success: false, error: "Message can't be empty." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in." };

  const { error } = await supabase.from("messages").insert({
    thread_id: thread_id || undefined,
    sender_id: user.id,
    recipient_id,
    project_id,
    body,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

// ---------------------------------------------------------------
// Website content (small CMS)
// ---------------------------------------------------------------
export async function upsertSiteContent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const section_key = String(formData.get("section_key") || "").trim();
  const contentRaw = String(formData.get("content") || "").trim();

  if (!section_key || !contentRaw) {
    return { success: false, error: "Section key and content are required." };
  }

  let content: unknown;
  try {
    content = JSON.parse(contentRaw);
  } catch {
    return { success: false, error: "Content must be valid JSON." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("site_content")
    .upsert(
      { section_key, content: content as never, updated_by: user?.id ?? null, updated_at: new Date().toISOString() },
      { onConflict: "section_key" }
    );

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/content");
  return { success: true };
}
