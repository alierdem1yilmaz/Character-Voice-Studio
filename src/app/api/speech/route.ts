import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/fal";
import { persistRemoteFile, supabaseServer } from "@/lib/supabase";
import { EMOTIONS, VOICES, type Emotion } from "@/lib/types";

const ENGLISH_ONLY = /^[\x00-\x7F]*$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const characterId =
    typeof body?.characterId === "string" ? body.characterId : "";
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const emotion = typeof body?.emotion === "string" ? body.emotion : "";

  if (!characterId || !text) {
    return NextResponse.json(
      { error: "Karakter ve konuşma metni zorunludur." },
      { status: 400 }
    );
  }
  if (!EMOTIONS.includes(emotion as Emotion)) {
    return NextResponse.json(
      { error: "Geçerli bir duygu seçilmelidir." },
      { status: 400 }
    );
  }
  if (!ENGLISH_ONLY.test(text)) {
    return NextResponse.json(
      { error: "Bu projede yalnızca İngilizce konuşma metinleri kullanılmalıdır." },
      { status: 400 }
    );
  }

  try {
    const supabase = supabaseServer();
    const { data: character, error: characterError } = await supabase
      .from("characters")
      .select("id, voice")
      .eq("id", characterId)
      .single();

    if (characterError || !character) {
      throw new Error("Karakter bulunamadı.");
    }
    const voice = character.voice as (typeof VOICES)[number];

    const falAudioUrl = await generateSpeech(text, voice, emotion as Emotion);
    const audioUrl = await persistRemoteFile(
      "character-audio",
      falAudioUrl,
      `${characterId}.mp3`
    );

    const { data, error } = await supabase
      .from("voice_generations")
      .insert({ character_id: characterId, text, emotion, audio_url: audioUrl })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ generation: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Ses oluşturulamadı: ${message}` },
      { status: 500 }
    );
  }
}
