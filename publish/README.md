# Publish pack

Alat bantu untuk mengubah satu episode jadi paket upload siap tempel: caption +
hashtag per platform, halaman review untuk mengedit dan menyalin, plus adapter
API untuk upload otomatis begitu kredensialnya ada.

Tidak ada yang terkirim otomatis. Default-nya **dry run** dan semua platform
diset ke setelan paling privat.

---

## Dashboard

```bash
npm run dashboard            # http://127.0.0.1:4173
npm run dashboard -- --port 4200 --no-open
```

Satu halaman lokal untuk semua episode:

- strip 5 part dengan status master/pack
- pilih episode → poster, logline, ukuran file, dan kesiapan pack
- tabel caption per platform: panjang karakter, jumlah tag, status kredensial (api/manual)
- **Generate pack** (pakai LLM kalau `LLM_API_KEY` ada) atau **Template only**
- **Open review** membuka halaman edit/copy untuk episode itu
- **Dry-run upload** menjalankan `post.mjs` dan menampilkan paket manual di terminal
- **Pack missing** mengisi semua episode yang belum punya pack (template)
- copy caption per platform, atau copy semua sekaligus
- shortcut: `1`–`5` ganti episode, `G` generate, `T` template

Halaman ini hanya membaca dan menulis file lokal. Tidak ada upload dari dashboard;
itu tetap tugas `post.mjs --yes`.

---

## Alur kerja

```bash
# 1. bikin paket caption untuk Part 5
node publish/generate.mjs --episode 5 --open

# 2. edit / copy dari halaman review, upload manual
#    publish/out/ep05/review.html

# 3. kalau kredensial sudah ada, cek dulu rencananya
node publish/post.mjs --episode 5

# 4. baru kirim beneran
node publish/post.mjs --episode 5 --platforms youtube --yes
```

Tanpa API key LLM, generator tetap jalan memakai copy template yang sudah ditulis
per episode (`publish/episodes.json`). Hasilnya lebih kaku tapi tetap layak.

---

## Yang dihasilkan

```
publish/out/ep05/
  captions.json          # sumber kebenaran, dipakai post.mjs
  review.html            # halaman review: edit, copy, checklist, buka upload
  youtube.en.txt         # satu file per platform per bahasa
  youtube.id.txt
  tiktok.en.txt
  instagram.en.txt
  facebook.en.txt
  x.en.txt
  post-log-YYYY-MM-DD.json
```

Halaman review punya:

- dua bahasa (EN / ID) — ganti dengan tombol di atas
- editor untuk title, caption dan hashtag, dengan hitungan karakter live
- peringatan kalau melewati batas platform
- tombol **Copy caption**, **Copy title + caption**, **Save .txt**, **Upload page**
- checklist per platform yang tersimpan di browser (localStorage)

---

## Caption otomatis (LLM)

Isi `LLM_API_KEY` di `.env`. Endpoint-nya OpenAI-compatible, jadi bisa OpenAI,
OpenRouter, Groq, Together, atau server lokal:

```bash
LLM_API_KEY=sk-...
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=openai/gpt-4o-mini
```

Model diberi: judul episode, logline, beat, kutipan persis dari episode, CTA,
pool hashtag, dan batas tiap platform. Yang diminta: JSON berisi caption per
platform per bahasa, hook berbeda tiap platform, tanpa spoiler.

Kalau model gagal atau mengembalikan format aneh, tool otomatis kembali ke copy
template dan memberi tahu di terminal.

Atur nada di `publish/config.json` → `style`.

---

## Kaitkan akun

Satu tombol per platform: buka `/connect` di dashboard, tempel Client ID/Secret
app-mu sekali, tekan **connect →**, klik Allow. Token masuk `.env` sendiri dan
token X/TikTok di-refresh otomatis.

```bash
npm run dashboard     # lalu buka http://127.0.0.1:4173/connect
npm run doctor        # cek token menunjuk ke akun yang benar
```

Yang tetap manual hanya pembuatan developer app (platform mewajibkannya). Langkah
per platform, scope, dan jebakannya ada di [`CONNECT.md`](CONNECT.md).

Dashboard juga punya tombol **check links** yang menjalankan pemeriksaan yang
sama dan menampilkan nama akun di kolom Link.

## Platform

| Platform | Batas | Setelan default | Yang perlu disiapkan |
|---|---|---|---|
| YouTube Shorts | title 100, desc 5000 | `private` | OAuth client + refresh token, scope `youtube.upload` |
| TikTok | 2200 | `SELF_ONLY` | Content Posting API; app belum diaudit hanya boleh SELF_ONLY |
| Instagram Reels | 2200 | langsung publish | akun Business/Creator + Facebook Page + `instagram_content_publish` |
| Facebook Reels | 5000 | langsung publish | Page + token dengan `publish_video` |
| X | 280 | langsung publish | OAuth 2.0 user token, `tweet.write` + `media.write` (tier berbayar) |

Catatan penting:

- **Instagram dan Facebook tidak punya mode draft.** Begitu `post.mjs --yes`
  dijalankan, Reels langsung tayang. Kalau mau aman, upload manual dulu.
- **YouTube default `private`.** Ganti `YT_PRIVACY` kalau sudah yakin.
- **TikTok** memaksa `SELF_ONLY` untuk app yang belum diaudit — video masuk ke
  akun sebagai privat, bukan tayang.
- **X** butuh akses API berbayar. Tanpa itu, pakai jalur manual.

Adapter ini belum pernah diuji ke akun asli. Perlakukan run pertama tiap platform
sebagai tes: upload satu video privat, cek hasilnya, baru pakai rutin.

---

## Manual (jalur yang selalu berhasil)

Kalau kredensial belum ada, `post.mjs` tidak error — dia menulis daftar file
caption dan URL upload tiap platform. Tinggal buka `review.html`, copy, tempel.

Checklist yang biasa terlewat:

- Cover/thumbnail dipilih manual (0.5 s untuk TikTok, frame monitor untuk Reels)
- Share to Feed aktif di Instagram
- Post dari Page, bukan profil pribadi, untuk Facebook Reels
- Video di-attach native di X, jangan link

---

## Menambah episode

Tambah satu objek di `publish/episodes.json`:

```json
{
  "key": "ep06",
  "part": 6,
  "file": "THE_LAST_MESSAGE_Part6.mp4",
  "poster": "poster6.jpg",
  "title": "JUDUL",
  "alias": null,
  "runtime": "about a minute",
  "en": {"logline": "...", "hook": "...", "beats": ["..."], "quote": "...", "cta": "...", "tags": ["#TheLastMessage"]},
  "id": {"logline": "...", "hook": "...", "beats": ["..."], "quote": "...", "cta": "...", "tags": ["#TheLastMessage"]}
}
```

`file` dan `poster` relatif ke `HASIL/`. Setelah itu:

```bash
node publish/generate.mjs --episode 6 --open
```

---

## Mengubah tag

Semua hashtag wajib berasal dari `series.baseTags` di `config.json`. Model tidak
boleh mengarang tag baru, dan `generate.mjs` membuang tag di luar pool. Tambah
tag di situ kalau butuh.

---

## Kalau ada masalah

| Gejala | Sebab |
|---|---|
| `no credentials` | `.env` belum diisi untuk platform itu — pakai jalur manual |
| `401` di YouTube | refresh token kedaluwarsa atau scope kurang |
| `instagram container` error | akun bukan Business/Creator, atau belum terhubung ke Page |
| `TikTok init` error | app belum diaudit → `SELF_ONLY`, atau scope `video.publish` belum ada |
| caption kepotong | batas platform; edit di `review.html` sebelum copy |
