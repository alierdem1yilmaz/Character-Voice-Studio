import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/fal";
import { VOICES } from "@/lib/types";

const PREVIEW_TEXT = "Hi there! This is a quick preview of my voice.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const voice = typeof body?.voice === "string" ? body.voice : "";

  if (!VOICES.includes(voice as (typeof VOICES)[number])) {
    return NextResponse.json(
      { error: "Geçerli bir ses seçilmelidir." },
      { status: 400 }
    );
  }

  try {
    const audioUrl = await generateSpeech(
      PREVIEW_TEXT,
      voice as (typeof VOICES)[number],
      "Neutral"
    );
    return NextResponse.json({ audioUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Ses önizlemesi alınamadı: ${message}` },
      { status: 500 }
    );
  }
}
