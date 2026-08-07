import { supabase } from "@/lib/supabase";

export async function uploadPropertyImage(
  userId: string,
  file: File
): Promise<string> {
  if (!file || typeof file.name !== "string") {
    throw new Error("Invalid property image file.");
  }

  const ext =
    file.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "jpg";

  const path =
    `${userId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return supabase.storage
    .from("property-images")
    .getPublicUrl(path)
    .data.publicUrl;
}
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  if (!file || typeof file.name !== "string") {
    throw new Error("Invalid profile image file.");
  }

  const ext =
    file.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "jpg";

  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(path, file, {
      upsert: true,
    });

  if (error) throw error;

  return supabase.storage
    .from("profile-images")
    .getPublicUrl(path)
    .data.publicUrl;
}
