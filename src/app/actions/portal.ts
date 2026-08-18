"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = { success: boolean; error?: string };

export async function sendPortalReply(
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
  revalidatePath("/portal/messages");
  if (thread_id) revalidatePath(`/portal/messages/${thread_id}`);
  return { success: true };
}
