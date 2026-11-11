# Release desk

Satu folder video vertikal masuk, satu paket upload keluar: caption + hashtag per
platform, halaman review untuk mengedit dan menyalin, adapter API untuk upload
otomatis, dan pemeriksa akun. Tidak terikat pada satu seri — arahkan ke folder
video apa pun.

Tidak ada yang terkirim otomatis. Default **dry run**, dan tiap platform diset ke
setelan paling privat yang diizinkan.

---

## Mulai dari nol (video milikmu sendiri)

```bash
npm run setup
```

Pertanyaan yang muncul: nama seri, handle, folder video, bahasa, dan pool
hashtag. Lalu setup akan:

- memindai folder itu (`.mp4 .mov .m4v .webm`), mengurutkan berdasarkan nomor
  part di nama file, dan memberi judul dari nama file
- membaca durasi lewat `ffprobe` dan mengambil poster dari detik 1 lewat `ffmpeg`
  (kalau keduanya terpasang)
- menulis `publish/config.json` (seri + folder) dan `publish/episodes.json`
  (satu entri per video)
- membuat `.env` dari template, permission `600`

Tanpa TTY (mis. di server) semua nilai bisa diberikan lewat flag:

```bash
npm run setup -- --dir ~/clips --series "Night Drive" --handle @nightdrive \
  --langs en,id --tags "#nightdrive,#shortfilm,#horror" --yes

npm run setup -- --dir ~/clips --dry-run    # lihat rencananya, tidak menulis
```

File lama tidak pernah ditimpa diam-diam: `config.json.bak` dan
`episodes.json.bak` dibuat sebelum menulis, dan entri yang sudah ada dipertahankan
(lengkap dengan brief-nya).

Folder video boleh di luar repo. Kalau `publish/episodes.json` dihapus, desk
memindai folder itu setiap kali dibuka — cukup untuk mencoba sebelum menulis
brief.

---

## Dashboard

```bash
npm run dashboard            # http://127.0.0.1:4173
npm run dashboard -- --port 4200 --no-open
```

Satu halaman lokal:

- strip episode dengan status master/pack, dari hasil scan atau `episodes.json`
- pilih episode → poster, judul, ukuran file, kesiapan pack
- tabel caption per platform: panjang karakter, jumlah tag, status kredensial
  (`api` / `manual`)
- **Generate pack** (LLM kalau `LLM_API_KEY` ada) atau **Template only**
- **Open review** membuka halaman edit/copy untuk episode itu
- **Dry-run upload** menjalankan `post.mjs` dan menampilkan rencananya
- **Pack missing** mengisi semua episode yang belum punya pack (template)
- **Connect accounts** → halaman `/connect` untuk menautkan akun
- shortcut: `1`–`5` ganti episode, `G` generate, `T` template

Dashboard hanya membaca dan menulis file lokal. Tidak ada upload dari dashboard;
itu tetap tugas `post.mjs --yes`.

---

## Alur kerja

```bash
npm run pack -- --episode 1 --open      # caption untuk video pertama
# edit / copy dari publish/out/ep01/review.html, upload manual

npm run pack:post -- --episode 1        # cek rencana upload (dry run)
npm run pack:post -- --episode 1 --platforms youtube --yes   # kirim beneran
```

Flag yang berguna:

| Flag | Arti |
|---|---|
| `--episode N` | nomor part (default: episode pertama) |
| `--lang en,id` | bahasa yang dibuat |
| `--no-llm` | paksa copy template |
| `--dir <folder>` | pindai folder lain tanpa mengubah config |
| `--out <folder>` | tulis pack ke folder lain (buat preview) |
| `--open` | buka review page setelah selesai |

---

## Yang dihasilkan

```
publish/out/ep01/
  captions.json          # sumber kebenaran, dipakai post.mjs
  review.html            # edit, copy, checklist, buka halaman upload
  youtube.en.txt         # satu file per platform per bahasa
  tiktok.en.txt
  instagram.en.txt
  facebook.en.txt
  x.en.txt
```

Halaman review punya: pemilih bahasa, editor title/caption/hashtag dengan hitungan
karakter live, peringatan saat melewati batas platform, tombol **Copy caption**,
**Copy title + caption**, **Save .txt**, **Upload page**, dan checklist per
platform yang tersimpan di browser.

Pack terikat ke file videonya. Ganti folder atau seri, dan pack lama otomatis
dianggap tidak ada — tidak ada caption seri lain yang nyasar muncul.

---

## Caption: tiga tingkat

1. **Brief tertulis** di `publish/episodes.json` (per episode, per bahasa) —
   hasil paling tajam, tanpa perlu LLM.
2. **LLM** — isi `LLM_API_KEY` di `.env`. Endpoint OpenAI-compatible: OpenAI,
   OpenRouter, Groq, Together, atau server lokal.
3. **Generic** — kalau tidak ada brief dan tidak ada LLM, desk tetap menulis
   caption yang rapi dari judul, nomor part, dan durasi. Cukup untuk diposting,
   tapi datar.

```bash
LLM_API_KEY=sk-...
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=openai/gpt-4o-mini
```

Brief yang dikirim ke model: logline, beat, kutipan persis, CTA, pool hashtag, dan
batas tiap platform. Kalau model gagal, tool kembali ke template dan memberi tahu
di terminal. Nada dan aturan ada di `config.json` → `style`.

---

## Kaitkan akun

Satu tombol per platform: buka `/connect`, tempel Client ID/Secret app-mu sekali,
tekan **connect →**, klik Allow. Token masuk `.env` sendiri, dan token X (2 jam)
serta TikTok (24 jam) di-refresh otomatis.

```bash
npm run dashboard     # lalu buka http://127.0.0.1:4173/connect
npm run doctor        # cek token menunjuk ke akun yang benar
```

Yang tetap manual hanya pembuatan developer app — platform mewajibkannya. Langkah
per platform, scope, dan jebakannya ada di [`CONNECT.md`](CONNECT.md).

---

## Platform

| Platform | Batas | Setelan default | Yang perlu disiapkan |
|---|---|---|---|
| YouTube Shorts | title 100, desc 5000 | `private` | OAuth client, scope `youtube.upload` + `youtube.readonly` |
| TikTok | 2200 | `SELF_ONLY` | Content Posting API; app belum diaudit hanya boleh SELF_ONLY |
| Instagram Reels | 2200 | langsung publish | akun Business/Creator + Page + `instagram_content_publish` |
| Facebook Reels | 5000 | langsung publish | Page token dengan `pages_manage_posts` |
| X | 280 | langsung publish | OAuth 2.0 user token, `tweet.write` + `media.write` |

- **Instagram dan Facebook tidak punya draft.** Begitu `--yes` dijalankan, Reels
  langsung tayang. Uji dengan video pendek dulu.
- **YouTube default `private`**, TikTok `SELF_ONLY`.
- **X** butuh plan dengan akses write.
- Adapter belum diuji ke akun asli di repo ini. Run pertama tiap platform:
  video privat, cek hasilnya, baru jadikan rutin.

---

## Manual (jalur yang selalu berhasil)

Tanpa kredensial, `post.mjs` tidak error — dia menulis daftar file caption dan URL
upload tiap platform. Buka `review.html`, copy, tempel.

Yang biasa terlewat: cover/thumbnail manual (0.5 s untuk TikTok), Share to Feed di
Instagram, post dari Page (bukan profil) untuk Facebook Reels, dan attach video
native di X (jangan link).

---

## Mengubah seri

`publish/config.json`:

```jsonc
{
  "series": {
    "name": "Night Drive",        // dipakai di title YouTube dan caption generic
    "handle": "@nightdrive",
    "kind": "short-form video series",  // konteks untuk LLM
    "watermark": "NightDrive",
    "baseTags": ["#nightdrive"]   // satu-satunya pool hashtag yang diizinkan
  },
  "languages": ["en", "id"],
  "videoDir": "videos",           // relatif ke root repo, atau absolut
  "outputDir": "publish/out"
}
```

Semua hashtag wajib berasal dari `series.baseTags`. Model tidak boleh mengarang tag
baru, dan `generate.mjs` membuang tag di luar pool.

Menambah episode tanpa setup:

```json
{
  "key": "ep06",
  "part": 6,
  "file": "my-video.mp4",
  "poster": "poster6.jpg",
  "title": "JUDUL",
  "runtime": "1:02",
  "en": {"logline": "...", "hook": "...", "beats": ["..."], "quote": "...", "cta": "...", "tags": ["#nightdrive"]}
}
```

`en`/`id` boleh dihilangkan — caption generic yang akan dipakai. `poster` boleh
`null`; halaman review akan menyembunyikan gambarnya.

---

## Kalau ada masalah

| Gejala | Sebab |
|---|---|
| dashboard kosong | tidak ada video di `videoDir` — jalankan `npm run setup -- --dir <folder>` |
| `no credentials` | `.env` belum diisi untuk platform itu — pakai jalur manual |
| master `missing` | `file` di episodes.json tidak cocok dengan isi folder |
| `401` di YouTube | refresh token kedaluwarsa (7 hari di mode Testing) atau scope kurang |
| `instagram container` error | akun bukan Business/Creator, atau belum terhubung ke Page |
| `TikTok init` error | app belum diaudit → `SELF_ONLY`, atau scope `video.publish` belum ada |
| caption kepotong | batas platform; edit di `review.html` sebelum copy |
