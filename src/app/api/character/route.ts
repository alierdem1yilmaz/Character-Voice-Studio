import { NextRequest, NextResponse } from "next/server";
import { buildCharacterImagePrompt, generateCharacterImage } from "@/lib/fal";
import { persistRemoteFile, supabaseServer } from "@/lib/supabase";
import { VOICES } from "@/lib/types";

export async function GET() {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("characters")
      .select()
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return NextResponse.json({ character: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Karakter yüklenemedi: ${message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const personality =
    typeof body?.personality === "string" ? body.personality.trim() : "";
  const appearance =
    typeof body?.appearance === "string" ? body.appearance.trim() : "";
  const voice = typeof body?.voice === "string" ? body.voice : "";

  if (!name || !personality || !appearance) {
    return NextResponse.json(
      { error: "İsim, kişilik ve görünüş açıklaması zorunludur." },
      { status: 400 }
    );
  }
  if (!VOICES.includes(voice as (typeof VOICES)[number])) {
    return NextResponse.json(
      { error: "Geçerli bir ses seçimi yapılmalıdır." },
      { status: 400 }
    );
  }

  try {
    const prompt = buildCharacterImagePrompt({ name, personality, appearance });
    const falImageUrl = await generateCharacterImage(prompt);
    const imageUrl = await persistRemoteFile(
      "character-images",
      falImageUrl,
      `${name.toLowerCase().replace(/\s+/g, "-")}.png`
    );

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("characters")
      .insert({ name, personality, appearance, voice, image_url: imageUrl })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ character: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Karakter oluşturulamadı: ${message}` },
      { status: 500 }
    );
  }
}
