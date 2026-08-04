import { createClient } from "@supabase/supabase-js";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. .env.local dosyasini kontrol et (bkz. README.md).`
    );
  }
  return value;
}

export function supabaseServer() {
  return createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_ANON_KEY"), {
    auth: { persistSession: false },
  });
}

async function uploadToBucket(
  bucket: string,
  path: string,
  data: Blob,
  contentType: string
) {
  const supabase = supabaseServer();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, data, { contentType, upsert: false });
  if (error) throw new Error(`Supabase storage yukleme hatasi: ${error.message}`);
  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl.publicUrl;
}

/** Supabase Storage anahtarlari icin guvenli olmayan (Turkce vb.) karakterleri temizler. */
function sanitizeStorageKey(fileName: string): string {
  const normalized = fileName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, ""); // aksan isaretlerini kaldir (ö -> o, ş -> s, vb.)
  return normalized.replace(/[^a-zA-Z0-9._-]/g, "-");
}

/** fal.ai'nin urettigi gecici dosya URL'ini indirip Supabase Storage'a kalici olarak yukler. */
export async function persistRemoteFile(
  bucket: string,
  sourceUrl: string,
  fileName: string
): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Uretilen dosya indirilemedi: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  const blob = await response.blob();
  const path = `${Date.now()}-${sanitizeStorageKey(fileName)}`;
  return uploadToBucket(bucket, path, blob, contentType);
}
