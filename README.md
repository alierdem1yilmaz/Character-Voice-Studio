# Character Voice Studio

Kendi karakterini oluştur, ona bir ses ve duygu seç, İngilizce bir metin yaz ve
karakterini konuştur. Next.js + Supabase + fal.ai (FLUX & ElevenLabs) ile
yapıldı.

## Kurulum

### 1. Supabase

1. [supabase.com](https://supabase.com) üzerinde giriş yap → **New Project**.
2. Proje oluşunca **SQL Editor**'e git, `supabase/schema.sql` dosyasının
   tamamını yapıştırıp çalıştır. Bu, `characters` ve `voice_generations`
   tablolarını, RLS politikalarını ve görsel/ses dosyaları için gerekli
   `character-images` / `character-audio` storage bucket'larını oluşturur.
3. **Project Settings → API** bölümünden `Project URL` ve `anon public` key
   değerlerini kopyala.

### 2. fal.ai

1. [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) üzerinden hesap aç
   ve bir API key oluştur.

### 3. Ortam değişkenleri

`.env.local` dosyasını aç ve şu değerleri doldur (bu dosya `.gitignore`
içinde, asla commit edilmez):

```
FAL_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

### 4. Çalıştır

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` (port doluysa terminalde yazan port) adresini aç.

## Deploy (Vercel)

Vercel projesine aşağıdaki environment variable'ları ekle (Project Settings →
Environment Variables), ardından deploy et:

```
FAL_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
```

## Teknik notlar

- Karakter görseli `fal-ai/flux/schnell`, ses `fal-ai/elevenlabs/tts/eleven-v3`
  ile üretilir; her iki çağrı da yalnızca sunucu tarafında
  (`src/app/api/*/route.ts`) yapılır — API anahtarları tarayıcıya hiç gitmez.
- Üretilen görsel/ses dosyaları fal.ai'den indirilip kalıcı olarak Supabase
  Storage'a yüklenir, veritabanına o kalıcı URL kaydedilir.
- Konuşma metni yalnızca İngilizce (ASCII) karakterlerle sınırlıdır.
