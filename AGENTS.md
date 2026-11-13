# THE LAST MESSAGE — PROJECT CONTEXT & PRODUCTION BIBLE

> **Baca file ini dulu, sebelum menyentuh apa pun.**
> Ini satu-satunya sumber kebenaran soal gaya, karakter, timing, render, dan
> aturan kerja. Kalau isi file ini bertabrakan dengan tebakanmu, file ini menang.
> Kalau bertabrakan dengan brief baru dari pemilik project, **tanya dulu**, jangan
> diam-diam pilih salah satu.

Repo: `eleven-fifty-nine` (public, source-available, bukan open source).
Seri: **THE LAST MESSAGE**, 6 part, vertikal 9:16, 2D anime vector, dibuat 100% di
kode (React + Remotion). Tidak ada stock footage, tidak ada AI video.

---

## 0. ATURAN KERJA (WAJIB, TIDAK BISA DINEGOSIASI)

### 0.1 Urutan baca setiap kali ada permintaan baru

1. **File ini** (`AGENTS.md`) — konteks global.
2. **Brief part yang diminta** — `BAHAN/ptN/*.md` (production bible / storyboard /
   audio-synced script).
3. **Audio part itu** — `BAHAN/ptN/*.mp3` (dan salinannya di `public/audio/`).
4. **Gambar/referensi** di folder part tersebut, kalau ada.
5. **Kode part sebelumnya** — `src/Part(N-1).tsx` + entry `src/c(N-1).tsx`.
6. **Karakter** — `src/character/Noah.tsx`, `Amara.tsx`, `DrElias.tsx`.
7. **Shared** — `src/Episode.tsx` (`Cam`, `Grain`, `Vignette`, `Room`, `RainStreaks`).
8. **Deliverable sebelumnya** — `HASIL/index.html`, `publish/episodes.json`,
   `README.md` (supaya penomoran, poster, dan copy konsisten).

Jangan menebak isi brief. Baca filenya.

### 0.2 Wajib bertanya sebelum langkah besar

Berhenti dan tanya **sebelum**:

- menambah, menghapus, menggabungkan, atau mengurut ulang shot;
- mengubah fitur karakter yang dikunci (scar, poni, bun, anting, kostum, warna
  kulit, bentuk wajah);
- menambah teks di layar di luar daftar teks resmi part itu;
- mengubah canvas, fps, codec, watermark, atau audio;
- menimpa / menghapus file yang sudah ada (apalagi `src/Part*.tsx` yang sedang
  dipakai);
- `git commit`, `git push`, atau mengubah branch;
- memilih kreatif yang punya dua jawaban sama kuatnya (mis. poster pakai frame A
  atau B).

Pertanyaan harus **spesifik dan ada pilihannya**, bukan "mau dilanjut?".

### 0.3 Wajib bikin report setiap langkah selesai

Setiap unit kerja (satu shot, satu pass polish, satu render, satu packaging)
ditutup dengan report pendek:

```
## Report — <nama langkah>
Status: selesai / sebagian / gagal
Yang dikerjakan: <1–3 baris, bahasa manusia>
File yang berubah: <path: apa yang berubah>
Verifikasi: <perintah + hasil nyata, bukan klaim>
Masalah / catatan: <kalau ada>
Butuh keputusanmu: <pertanyaan atau "tidak ada">
Langkah berikutnya: <dan tunggu izin kalau masuk kategori 0.2>
```

Aturan report:
- verifikasi harus berupa output nyata (`tsc` exit code, `ffprobe` angka, nama
  file still yang sudah dilihat). Jangan tulis "sudah dicek" tanpa bukti;
- kalau gagal, tulis gagalnya dan apa yang sudah dicoba;
- jangan menumpuk 10 langkah lalu lapor sekali.

### 0.4 Definisi "selesai" satu part

Part baru dianggap selesai kalau **semua** ini benar:

1. `src/PartN.tsx` typecheck bersih (`npx tsc --noEmit` exit 0).
2. `src/cN.tsx` ada, `durationInFrames` = jumlah frame dari durasi audio nyata.
3. QC still sudah dilihat di **setiap cut** dan minimal 2 frame per shot.
4. Master dirender, lolos checklist §10.
5. `HASIL/THE_LAST_MESSAGE_PartN.mp4` + `HASIL/posterN.jpg` ada.
6. `HASIL/index.html`, `publish/episodes.json`, `README.md`, `HASIL/README.md`
   sudah memuat part baru.
7. Commit source/docs saja; **tidak ada `*.mp4` yang ter-track**.

---

## 1. KONTRAK DELIVERABLE

| Item | Nilai |
|---|---|
| Canvas | 1080 × 1920 (9:16) |
| FPS | 30 |
| Video | H.264, yuv420p, CRF 19 |
| Audio | AAC 48 kHz stereo, dari MP3 asli part itu |
| Watermark | teks `EldraMyth`, kanan atas, kecil, redup |
| Tail | frame hitam di akhir, **di dalam** durasi audio |
| Master | tidak pernah masuk repo (`*.mp4` di `.gitignore`) |
| Poster | 1080×1920 JPG, dari frame final master |

Watermark persis (Part 6):

```tsx
right: 32, top: 44, fontFamily: SANS, fontSize: 16,
letterSpacing: '0.34em', color: 'rgba(210,226,238,0.32)',
textShadow: '0 1px 8px rgba(0,0,0,0.8)', zIndex: 60
```

Watermark disembunyikan di tail hitam (`f < C.s20 ? <Watermark /> : null`).

---

## 2. PETA REPO

```
.
├─ AGENTS.md              ← file ini
├─ HASIL/                 poster + pemutar (master TIDAK ikut)
│  ├─ index.html          screening room, 6 part, 100% client-side
│  └─ poster1..6.jpg
├─ BAHAN/                 brief + audio per part (pt2 … pt6)
├─ public/audio/          audio yang dipakai saat render (vo.mp3, pt2..pt6.mp3, rain.wav)
├─ src/
│  ├─ character/          Noah.tsx, Amara.tsx, DrElias.tsx
│  ├─ Episode.tsx         Part 1 + shared: Cam, Grain, Vignette, Room, RainStreaks
│  ├─ Part2.tsx … Part6.tsx
│  └─ c5, c7, c8, c9, c10, c11.tsx   entry render per part
├─ publish/               release desk (captions, review page, adapters)
├─ docs/                  screenshot untuk README
└─ out/                   working render (ignored)
```

Entry point per part (jangan pakai `src/index.ts`, itu gagal
`delayRender() "Loading root component"`):

| Part | Entry | Composition id | Frames (kode) | Durasi |
|---|---|---|---|---|
| 1 | `src/c5.tsx` | `Episode` | 1800 | 60.0 s |
| 2 | `src/c7.tsx` | `Part2` | 1358 | 45.3 s |
| 3 | `src/c8.tsx` | `Part3` | 1304 | 43.5 s |
| 4 | `src/c9.tsx` | `Part4` | 1816 | 60.5 s |
| 5 | `src/c10.tsx` | `Part5` | 2020 | 67.3 s |
| 6 | `src/c11.tsx` | `Part6` | 2497 | 83.2 s |

Angka frame di tabel `README.md` sudah disamakan dengan file `c*.tsx`. Kalau
suatu saat berubah, `c*.tsx` adalah sumber kebenarannya.

---

## 3. TIMELINE: AUDIO → FRAME (langkah pertama tiap part)

Jangan pernah memakai durasi dari storyboard. Storyboard sering salah
(Part 6: brief bilang 84.478 s, audio nyata 83.226 s).

```bash
# 1. durasi nyata
ffprobe -v error -show_entries format=duration -of csv=p=0 BAHAN/ptN/ptN.mp3

# 2. di mana kalimat mulai/berhenti
ffmpeg -hide_banner -i BAHAN/ptN/ptN.mp3 \
  -af "silencedetect=noise=-40dB:d=0.25" -f null - 2>&1 | grep silence

# 3. frame count (dibulatkan)
#    frame = round(durasi_detik * 30)
```

Kalau perlu presisi kata, pakai forced alignment Whisper (`base.en`) lalu
silangkan dengan `silencedetect`. Cut jatuh di kata, bukan di tenggat editorial.

Konvensi kode:

```tsx
const FPS = 30;
const T = (s: number) => Math.round(s * FPS);
const C = {s1: 0, s2: …, …, s20: …, total: N};
```

20 shot = 20 landmark. Shot ke-i hidup di `[C.si, C.s(i+1))`, shot 20 berakhir di
`C.total`. Tail hitam = sisa setelah cut terakhir, di dalam `C.total`.

### Part 6 — landmark nyata (referensi pola)

| Shot | Frame in | Detik | Isi |
|---|---|---|---|
| 01 | 0 | 0.00 | Elias, "He isn't supposed to remember." |
| 02 | 86 | 2.87 | pesan di ponsel Noah |
| 03 | 274 | 9.13 | pintu apartemen terbuka ke laboratorium |
| 04 | 544 | 18.13 | masuk lab, dinding monitor |
| 05 | 646 | 21.53 | rekaman berbeda, kematian berbeda, 11:59 |
| 06 | 857 | 28.57 | ponsel berdering, Amara |
| 07 | 917 | 30.57 | Amara di telepon |
| 08 | 1069 | 35.63 | Noah menyusuri koridor |
| 09 | 1199 | 39.97 | terminal bangun |
| 10 | 1272 | 42.40 | Noah asli, tiga tahun lalu |
| 11 | 1502 | 50.07 | Elias di semua layar |
| 12 | 1610 | 53.67 | Elias menuntut |
| 13 | 1756 | 58.53 | saklar darurat |
| 14 | 1892 | 63.07 | semua layar mati |
| 15 | 1962 | 65.40 | 11:59 → 12:00 AM (hard cut di 2050) |
| 16 | 2143 | 71.43 | monitor Amara restart |
| 17 | 2231 | 74.37 | `SUBJECT 002` (reveal 2262) |
| 18 | 2356 | 78.53 | ponsel Amara bergetar |
| 19 | 2426 | 80.87 | `DON'T TRUST NOAH.` → mata Amara (2462) |
| 20 | 2489 | 82.97 | tail hitam sampai 2497 |

---

## 4. KARAKTER — DESAIN TERKUNCI

Semua rig = SVG murni, satu bahasa visual. Jangan menambah fitur, jangan
"memperbaiki" proporsi tanpa izin.

### 4.1 Noah — `src/character/Noah.tsx`

- Artboard `0 0 600 1200`. Rambut hitam pendek, poni terbelah, kulit gelap hangat.
- **Scar wajib di alis KIRI secara anatomis** (kanan secara layar saat dia
  menghadap kamera). Ini kontinuitas 6 part, tidak boleh pindah sisi.
- Props: `expression`, `look`, `mouth`, `turn`, `glasses`, `rim`, `lidOverride`,
  `sweat`, `viewBox`, `preserve`, `style`.
- `expression`: `tired | neutral | alert | fear | sad | relief | unease | dread | shock | gasp`
- `look`: `camera | left | right | down | door | up`
- `viewBox` default penuh; untuk close-up pakai potongan eksplisit, contoh
  `viewBox="188 66 238 356"` (feed), `"150 24 300 480"` (medium), `"158 54 300 600"`
  (profil di tepi frame). Aturan umum: rasio viewBox mendekati 9:16 (0.5625)
  supaya tidak ada crop aneh — contoh close-up 104×185.
- `preserve` hampir selalu `"xMidYMid slice"` untuk mengisi frame.

Versi punggung: `NoahBack` (lokal di tiap `Part*.tsx`, artboard `0 0 400 720`).
Dipakai untuk shot berjalan/menghadap layar. Punya `rim` (0.7–1.5).

### 4.2 Amara — `src/character/Amara.tsx`

- Artboard `0 0 600 1200` (depan), `AmaraBack` `0 0 300 700` (punggung).
- Kunci desain: **low bun**, **anting silver** (hoop kecil + stud), jaket taktis
  gelap dengan turtleneck, kulit hangat, mata biru-kelabu.
- **Tidak pernah berbalik badan.** Shot "belakang" pakai `AmaraBack`, bukan
  memutar rig depan.
- Props: `expression`, `look`, `mouth`, `turn`, `rim`, `screen`, `viewBox`,
  `preserve`, `style`.
- `expression`: `calm | cold | focus | soft | guarded | defiant`
- `look`: `camera | left | right | down`
- `screen` = intensitas cahaya monitor di wajahnya (0–1).

### 4.3 Dr. Elias — `src/character/DrElias.tsx`

- Rig resmi, artboard `0 0 600 1200`. Rambut silver pendek disisir ke belakang,
  wajah panjang, mata dingin, coat gelap.
- Props: `expression`, `look`, `mouth`, `turn`, `rim`, `screen`, `viewBox`,
  `preserve`, `style`.
- `expression`: `calm | cold | stare | speak | concern | whisper`
- `look`: `camera | left | right | down | monitor`
- Di Part 6 dipakai lewat `EliasFeed` dengan 4 varian crop/turn/look/expression
  (`ELIAS_CROPS`, `ELIAS_TURNS`, `ELIAS_LOOKS`, `ELIAS_EXPR`) supaya layar-layar
  terlihat seperti feed berbeda, bukan salinan.

### 4.4 Aturan kontinuitas

- Noah versi arsip/original **identik** dengan Noah sekarang: wajah, scar, coat.
- Amara selalu kostum yang sama di semua part.
- Elias tidak boleh berubah kostum/rambut antar part.
- Hands: jangan pernah menampilkan tangan yang "menempel" tanpa pangkal lengan.
  Lengan harus masuk frame atau tertutup lengan baju.

---

## 5. BAHASA SINEMATIK

### 5.1 Kamera

Semua gerak kamera lewat `Cam` (`src/Episode.tsx`) atau div `transform`:

```tsx
const z = 1.01 + smooth((f - C.sN) / (C.sN1 - C.sN)) * 0.05; // 5–7% push-in
<Cam z={z} ox="50%" oy="44%">…</Cam>
```

- Push-in pelan 1–7%, tidak pernah zoom cepat.
- Handheld halus: `translateY(${Math.sin(f / 9) * 3}px)`.
- Sway: `Math.sin(f / 17) * 4` px.
- `transformOrigin` dipilih supaya wajah tidak melenceng saat push.
- Cut = hard cut. Tidak ada dissolve, tidak ada fade antar shot (kecuali
  blackout yang memang jadi bagian cerita).
- Tail hitam: `f >= C.s20` → `AbsoluteFill` hitam polos, tanpa watermark.

### 5.2 Cahaya

- Satu key dingin dari layar/monitor (`rgba(78–136, 146–200, 182–228, …)`), lalu
  satu practical amber (`#E2AA4A`, `#C8863A`) untuk ruang nyata.
- Rim light hanya di satu sisi kontur (biasanya kiri), `rgba(202,232,246,0.9)`
  memudar ke transparan. Jangan mengelilingi seluruh siluet.
- Karakter di depan layar: `rim` 1.0–1.5, wajah tetap 40–60% lebih gelap dari
  layar.
- Ruangan selalu lebih gelap dari subjek; subjek selalu lebih gelap dari layar.

### 5.3 Kedalaman (urutan layer, wajib)

1. base hitam (`#02050A`)
2. ambient radial
3. background (blur + gelap)
4. midground (set, monitor, furnitur)
5. karakter
6. atmosfer (haze, light pool, reflection)
7. vignette
8. grain
9. overlay teks + watermark

Background yang di-blur harus `position:absolute; inset:-Xpx` + `transform:
scale(1.14)` supaya tepi blur tidak terlihat.

---

## 6. COLOR GRADING & TEKSTUR (resep angka)

### 6.1 Palet inti

| Peran | Hex |
|---|---|
| Hitam dasar | `#02050A`, `#020407` |
| Ink / bayangan | `#04080C`, `#050A0E`, `#071017` |
| Dinding lab | `#0B1A24`, `#101F29`, `#1B2E3A` |
| Baja / housing | `#2E3A44`, `#46535E` |
| Layar mid | `#4E92B6`, `#6EAECE`, `#7EC0E0` |
| Layar terang | `#A8D8EE`, `#CEF0FF` |
| Highlight | `#E8F4FA`, `#D6F0FA` |
| Amber practical | `#E2AA4A`, `#D49A42`, `#C8863A` |
| Alarm / tombol | `#E2765C`, `#C44C36`, `#7A241C` |
| Kulit Noah (bayangan) | `#3B2A21` → `#1A120E` |
| Rambut Elias | `#868B8F` → `#1C2023` |

Accent per part (dipakai di `HASIL/index.html`):

| Part | Accent |
|---|---|
| 01 | `#8fb6d6` |
| 02 | `#d8a273` |
| 03 | `#c3b4a1` |
| 04 | `#b2a2c0` |
| 05 | `#9fc0c6` |
| 06 | `#c8a5a0` |

### 6.2 Grade per jenis gambar

```tsx
// feed/monitor (CCTV-ish, desaturasi, sedikit hijau-biru)
filter: `grayscale(0.52) contrast(1.12) brightness(${0.68 * bright * fl}) saturate(0.82)`

// body / archive feed
filter: `brightness(${bright}) contrast(1.08) saturate(0.8)`

// karakter di depan layar
filter: `brightness(0.8–1.05) contrast(1.05–1.1) saturate(1.02)`

// background out of focus
filter: `blur(26–36px) brightness(0.4–0.62)` + `transform: scale(1.14)`

// flash / glitch sesaat
mixBlendMode: 'screen', opacity 0.05–0.3, durasi 10–18 frame
```

### 6.3 Blur, grain, chrome

| Efek | Nilai |
|---|---|
| DOF background | `blur(26–36px)`, skala 1.14, brightness 0.4–0.62 |
| Glow / halo | `radial-gradient(closest-side, rgba(122,178,210,0.3), transparent 78%)` + `blur(20–42px)` + `mixBlendMode:'screen'` |
| Grain interior | opacity `0.07–0.08` (shared `Grain` default 0.16) |
| Vignette | `radial-gradient(1100px 1200px at 42% 38%, transparent 36%, rgba(0,0,0,0.76) 100%)` |
| Scanlines | `repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 1px, transparent 1px 4px)`, opacity 0.18–0.3, `multiply` |
| Screen glass | highlight 114° + `inset 0 0 80px rgba(0,0,0,0.72)`, strength 0.5–0.7 |
| Drop shadow karakter | `drop-shadow(0 26px 54px rgba(0,0,0,0.9))` |
| Panel/screen bevel | `border: 1px solid rgba(156,194,218,0.18–0.24)` + `inset 0 0 60–80px rgba(0,0,0,0.9)` |

---

## 7. TIPOGRAFI & KEBIJAKAN TEKS

- `SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'` → watermark, UI.
- `MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'` → jam, kode, label.
- Jam besar: `fontWeight 200–300`, `fontSize 168–172`, `letterSpacing 0.02–0.06em`,
  warna `rgba(240,249,253,0.96–0.98)`, `textShadow: 0 0 34–44px rgba(124–134,196–208,228–238,…)`.
- `SUBJECT 002`: `fontSize 118`, `letterSpacing 0.1em`, mono, di tengah frame.
- **Teks hanya boleh yang ada di brief part itu.** Daftar Part 6:

| Teks | Di mana |
|---|---|
| `11:59` | feed arsip + jam |
| `12:00 AM` | jam setelah cut 2050 |
| `SUBJECT 002` | monitor, reveal 2262 |
| `DON'T TRUST NOAH.` | layar ponsel Amara |
| `Find the room where you were born.` | pesan di ponsel Noah (diegetik, diminta brief) |
| `EldraMyth` | watermark |

Tidak ada subtitle, tidak ada title card, tidak ada label speaker, tidak ada
angka status acak. Kalau ragu apakah sebuah teks boleh, **tanya**.

---

## 8. AUDIO

- `public/audio/ptN.mp3` = file asli, **tidak** di-stretch, **tidak** di-render
  ulang, **tidak** ditambah SFX yang menutupi narasi.
- `Audio src={staticFile('audio/ptN.mp3')}` dipasang sekali di komponen induk.
- Heartbeat / breath yang sudah ada di MP3 tidak boleh diduplikasi.
- Tail hitam mengikuti durasi audio: `frame_total = round(durasi * 30)`; tail
  berakhir **di dalam** durasi itu.
- Contoh Part 6: audio 83.226 s → 2497 frame → kontainer 83.243 s (AAC padding),
  video 83.233 s. Video ≤ audio. Itu benar.

---

## 9. RENDER

```bash
# master satu part
npx remotion render src/c11.tsx Part6 out/part6.mp4 \
  --timeout=240000 --concurrency=3 --crf=19

# QC satu frame
npx remotion still src/c11.tsx Part6 out/qc/r1120.png --frame=1120 --concurrency=2
```

Aturan praktis:

- `--concurrency=3` aman; 4 lebih cepat tapi mesin berat.
- Render penuh 2500 frame ≈ 10–14 menit. Kalau hanya satu shot berubah:
  render still shot itu dulu untuk QC, render penuh sekali di akhir.
- Jangan render ulang seluruh master untuk perubahan yang belum disetujui.

---

## 10. QC CHECKLIST (jalankan, jangan diklaim)

```bash
ffprobe -v error \
  -show_entries format=duration,size \
  -show_entries stream=codec_name,codec_type,width,height,r_frame_rate,nb_frames,sample_rate,channels,duration \
  -of default=noprint_wrappers=1 out/partN.mp4

ffmpeg -hide_banner -i out/partN.mp4 -af volumedetect -f null /dev/null 2>&1 \
  | grep -E "mean_volume|max_volume"

# frame terakhir harus hitam murni
ffmpeg -v error -ss <durasi-0.25> -i out/partN.mp4 -frames:v 1 -y out/qc/tail.png
python3 -c "from PIL import Image; im=Image.open('out/qc/tail.png').convert('RGB'); print(im.getpixel((540,960)), im.getpixel((100,100)))"
```

Target:

| Cek | Lulus kalau |
|---|---|
| Resolusi | 1080 × 1920 |
| FPS | 30/1 |
| Codec | h264 + aac |
| Frame count | = `durationInFrames` |
| Audio | 48 kHz, 2 ch, durasi ≥ video |
| Loudness | peak < 0 dB, mean wajar (Part 6: −27.7 / −4.0 dB) |
| Tail | pixel (540,960) & sudut = (0,0,0) |
| Watermark | terlihat di frame 1, hilang di tail |
| Overlay | persis string brief, tidak ada teks lain |

QC visual: lihat still di **setiap cut** (`C.s1 … C.s20`) + 2 frame di tengah tiap
shot. Simpan ke `out/qc/`. Sebut nama file yang sudah dilihat di report.

---

## 11. PACKAGING

1. `cp out/partN.mp4 HASIL/THE_LAST_MESSAGE_PartN.mp4`
2. Poster: ambil frame final yang paling ikonik, simpan 1080×1920.
   ```bash
   npx remotion still src/cN.tsx PartN out/qc/poster.png --frame=<f> --concurrency=2
   python3 -c "from PIL import Image; Image.open('out/qc/poster.png').convert('RGB').save('HASIL/posterN.jpg', quality=92, optimize=True, progressive=True)"
   ```
   Poster tiap part harus beda komposisi — jangan dua part memakai jenis gambar
   yang sama (mis. dua-duanya dinding monitor).
3. `publish/episodes.json`: tambah objek `ep0N` dengan `key`, `part`, `file`,
   `poster`, `title`, `alias`, `runtime`, lalu `en` + `id` (`logline`, `hook`,
   `beats[3]`, `quote`, `cta`, `tags[6]`).
4. `HASIL/index.html`: tambah `<li>` episode (num/name/meta/prog id), entri
   `PARTS` (src/label/title/accent/dl/poster), id di array `progs`, dan
   perbarui hint keyboard kalau jumlah part berubah.
5. `README.md` + `HASIL/README.md`: tabel part, layout repo, command render,
   daftar teks resmi, catatan timeline.

---

## 12. GIT

- Branch kerja: `master`. Push: `git push origin HEAD` (bukan `main`).
- `.gitignore` sudah memblokir `*.mp4`, `*.mov`, `*.webm`, `*.m4v`, `out/`,
  `publish/out/`, `.env`, `node_modules`, `*.log`.
- Sebelum commit: `git ls-files | grep -E "\.(mp4|mov|webm|m4v)$"` → harus kosong.
- Commit source/docs saja. Master video tinggal di mesin pemilik project.
- `node_modules` bisa berupa symlink ke `/home/laflame/claude-motion/node_modules`
  — jangan dihapus, jangan di-commit.

---

## 13. JEBAKAN YANG SUDAH PERNAH MEMAKAN WAKTU

| Gejala | Sebab | Perbaikan |
|---|---|---|
| Elemen `position:absolute` tiba-tiba menempel ke parent yang salah | `filter` pada wrapper membuat containing block baru | wrapper yang punya `filter` wajib `position:'absolute', inset:0` |
| Kotak abu-abu transparan menutupi karakter | `<rect filter="url(#fractalNoise)">` → turbulence menghasilkan opaque grey | jangan pakai feTurbulence di rect penuh; pakai gradient/low-alpha overlay |
| Bagian rig hilang / warna salah antar komponen | id gradient SVG bertabrakan (`p6nbSkin` dsb.) | beri prefix per komponen (`p6nb`, `p6pe`, `eHair`, …) |
| Figur gelap hilang ke background | backlight halo ditaruh **di atas** figur | halo harus **sebelum** div karakter di DOM |
| Kepala "melayang" tanpa badan | karakter di-crop di tepi frame tanpa rim/pangkal lengan | tambah rim + lengan/bahu masuk frame, atau naikkan exposure |
| Wajah terlihat "mannequin" | crop `viewBox` terlalu lebar/sempit, leher ikut terlihat panjang | pilih `viewBox` setara aspect 9:16 (mis. 104×185 untuk close-up) |
| Render gagal `Loading root component` | memakai `src/index.ts` | pakai `src/cN.tsx` |
| Edit JSX besar gagal separuh | heredoc python salah indentasi | pakai `assert old in s` sebelum `write_text` |
| Master ter-render tapi shot salah | masih memakai frame lama | render ulang setelah `tsc` bersih; jangan campur |

---

## 14. TEMPLATE PART BARU (urutan eksekusi)

1. Baca `AGENTS.md` + `BAHAN/ptN/*` + audio. **Report: konteks yang dipahami.**
2. `ffprobe` + `silencedetect` → hitung frame total dan 20 landmark. **Tanya**
   kalau brief dan audio bertabrakan.
3. Tulis rencana 20 shot (frame in/out + isi + teks). **Minta persetujuan.**
4. `src/PartN.tsx`: helper dulu (palet, watermark, scanlines, glass, monitor,
   feed), lalu shot satu per satu, lalu komposisi induk `C` + `Audio`.
5. `src/cN.tsx` (1 baris composition, `durationInFrames` = frame total).
6. `npx tsc --noEmit` → harus 0.
7. Render still tiap cut + tengah shot → lihat semuanya → **report per pass**
   (shot mana yang masih lemah, apa yang diubah).
8. Ulangi 7 sampai bersih (maksimal 3 pass tanpa izin tambahan).
9. Render master penuh → QC §10 → **report angka nyata**.
10. Packaging §11 → commit source/docs → `git push origin HEAD` → **report**.

---

## 15. GLOSARIUM INTERNAL

- **feed** — gambar di dalam monitor: selalu punya scanline + glass + grade
  desaturasi, bukan gambar "bersih".
- **practical** — sumber cahaya yang terlihat di frame (lampu meja, amber, panel
  saklar).
- **push** — gerak kamera maju perlahan sepanjang satu shot.
- **landmark / `C.sN`** — frame mulai shot ke-N; satu-satunya cara memotong.
- **tail** — frame hitam setelah kata terakhir, di dalam durasi audio.
- **pass** — satu putaran polish menyeluruh sebelum render master.
