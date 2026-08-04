import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("voice_generations")
      .select(
        "id, character_id, text, emotion, audio_url, created_at, character:characters(id, name, image_url)"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    const generations = (data ?? []).map((row) => ({
      ...row,
      character: Array.isArray(row.character) ? row.character[0] ?? null : row.character,
    }));

    return NextResponse.json({ generations });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Geçmiş yüklenemedi: ${message}` },
      { status: 500 }
    );
  }
}
