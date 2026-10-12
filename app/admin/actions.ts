"use server";

import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase/server";

/**
 * Called by the dashboard after every save, so the public page shows the change at once
 * instead of after the hourly refresh. Only a signed-in admin can trigger it.
 */
export async function refreshSite(): Promise<{ ok: boolean }> {
  const db = await serverClient();
  const { data } = await db.auth.getUser();
  if (!data.user) return { ok: false };
  const { data: admin } = await db.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) return { ok: false };
  revalidatePath("/");
  return { ok: true };
}
