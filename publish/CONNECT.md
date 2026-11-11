# Kaitkan akun — sekali tombol

```bash
npm run dashboard        # atau ./BUKA-DASHBOARD.sh
```

Buka `http://127.0.0.1:4173/connect`, tempel **Client ID / Secret** sekali,
lalu tekan **connect →**. Browser akan membuka halaman izin platform, kamu klik
**Allow**, dan tokennya otomatis ditulis ke `.env`. Selesai — tidak ada lagi
copy-paste token.

Yang **tidak** bisa diotomatiskan: membuat developer app. Google, Meta, TikTok
dan X mewajibkan setiap alat punya app sendiri dengan izin yang disetujui
pemilik akun. Itu aturan mereka, bukan setelan tool ini. Jadi urutannya:

| Langkah | Siapa | Berapa lama |
|---|---|---|
| 1. Buat app + isi redirect URI | kamu | 5–10 menit per platform |
| 2. Tempel Client ID/Secret di `/connect` | kamu | 1 menit |
| 3. Tekan connect, klik Allow | kamu | 30 detik |
| 4. Token masuk `.env`, akun diverifikasi | tool | otomatis |
| 5. Refresh token X (2 jam) & TikTok (24 jam) | tool | otomatis selamanya |

Urutan yang paling masuk akal: **YouTube → Meta → TikTok → X**. YouTube dan
Meta tokennya panjang; TikTok dan X pendek tapi sekarang sudah di-refresh
sendiri.

Sebelum mulai, satu hal yang harus benar: **redirect URI** yang kamu daftarkan
di tiap app harus persis sama dengan yang ditampilkan di kartu `/connect`:

```
http://127.0.0.1:4173/callback
```

Kalau port 4173 sedang dipakai proses lain, server pindah ke 4174 dan URL di
kartu ikut berubah — daftarkan yang muncul di layar, bukan yang di dokumen ini.
Tempel URL-nya lewat tombol **copy** di kartu.

---

## 1. YouTube (paling gampang)

1. [console.cloud.google.com](https://console.cloud.google.com/) → buat project.
2. **APIs & Services → Library** → **YouTube Data API v3** → **Enable**.
3. **OAuth consent screen**:
   - User type **External**, isi nama app + email.
   - **Test users**: tambahkan email Google yang punya channel YouTube-mu.
4. **Credentials → Create credentials → OAuth client ID**:
   - Type **Desktop app**.
   - Isi **Authorized redirect URIs** dengan `http://127.0.0.1:4173/callback`.
   - Simpan **Client ID** dan **Client secret**.
5. Di `/connect` → kartu YouTube → tempel keduanya → **save app** → **connect →**.
6. Login, pilih channel, **Allow**. Kartu berubah jadi `LINKED` dengan nama channel.

**Soal umur token.** Selama consent screen masih **Testing**, Google menerbitkan
refresh token yang mati dalam **7 hari**. Pilihan: ulangi connect seminggu
sekali (30 detik), ajukan verifikasi app (scope upload tergolong sensitif), atau
pakai akun **Workspace** dengan User type **Internal** — tanpa batas 7 hari dan
tanpa verifikasi.

---

## 2. Meta — Instagram Reels + Facebook Reels (satu app)

1. Instagram harus **Professional** (Creator/Business) dan terhubung ke Facebook
   Page: Instagram app → Settings → Account type → Switch to professional,
   lalu hubungkan lewat Meta Business Suite.
2. [developers.facebook.com](https://developers.facebook.com/) → **Create app** →
   tipe **Business**.
3. Tambahkan produk **Facebook Login for Business** dan **Instagram**.
4. **App settings → Basic**: catat **App ID** dan **App secret**. Di **App
   roles** pastikan akunmu Admin/Tester.
5. **Facebook Login for Business → Settings** → **Valid OAuth Redirect URIs**:
   `http://127.0.0.1:4173/callback`.
6. Di `/connect` → kartu Meta → tempel App ID + secret → **save app** →
   **connect →** → **Allow** semua izin.
7. Kalau akunmu mengelola beberapa Page, muncul daftar Page. Pilih yang punya
   Instagram terhubung. Tool menulis Page token + `IG_USER_ID` sekaligus.

Selama app masih **Development mode**, token hanya bekerja untuk admin/tester
app — cukup untuk akunmu sendiri. App Review baru perlu kalau orang lain mau
memakai tool ini.

**Instagram dan Facebook tidak punya draft.** Begitu `publish/post.mjs --yes`
dijalankan, Reels langsung tayang. Uji dengan video pendek dulu.

---

## 3. TikTok

1. [developers.tiktok.com](https://developers.tiktok.com/) → **Manage apps** →
   buat app.
2. Tambahkan **Login Kit** dan **Content Posting API**; aktifkan **Direct Post**.
3. Minta scope `video.publish` dan `user.info.basic`.
4. **Redirect URI**: `http://127.0.0.1:4173/callback` (harus persis).
5. Tambahkan akun TikTok-mu sebagai **test user** (Sandbox).
6. Di `/connect` → kartu TikTok → tempel **Client key** + **secret** →
   **save app** → **connect →** → **Authorize**.

Tool menyimpan access token (~24 jam), refresh token (~1 tahun), dan
`TIKTOK_EXPIRES_AT`. Setiap kali mau posting, token di-refresh otomatis.

**Batasan yang tidak bisa diakali:** app yang belum diaudit hanya bisa posting
**privat** (`SELF_ONLY`), walaupun `TIKTOK_PRIVACY` diubah. Untuk posting publik
rutin, ajukan audit Content Posting API.

---

## 4. X

1. [developer.x.com](https://developer.x.com/) — pastikan plan-mu punya akses
   **write**.
2. Buat app → **User authentication settings** → enable **OAuth 2.0**.
3. Isi:
   - Type of App: **Native App** (tanpa secret) atau **Web App** (dengan secret)
   - **Callback URI**: `http://127.0.0.1:4173/callback` (harus persis)
   - Website URL: apa saja milikmu
4. Scopes: `tweet.read`, `tweet.write`, `users.read`, `media.write`,
   `offline.access` (yang terakhir ini wajib untuk refresh).
5. Di `/connect` → kartu X → tempel **client ID** (secret opsional) → **save
   app** → **connect →** → **Authorize app**.

Access token X hanya 2 jam. Tool menyimpannya bersama refresh token dan
`X_EXPIRES_AT`, lalu memperbarui sendiri sebelum kedaluwarsa.

---

## 5. Cek hasilnya

Dari dashboard: tombol **check links**. Dari terminal:

```bash
npm run doctor
```

Doctor memanggil API tiap platform dan menampilkan **nama akun** yang benar-benar
terhubung, bukan sekadar "token ada":

```
PLATFORM        STATUS    ACCOUNT          DETAIL
YouTube         linked    EldraMyth        channel UC…
Instagram       linked    @eldramyth       BUSINESS
TikTok          —         not configured   missing TIKTOK_ACCESS_TOKEN
0/5 linked · 1 failed
```

`FAILED` = kredensial ada tapi ditolak (token mati, scope kurang, plan tidak
mendukung). `—` = belum diisi. Hasilnya juga ditulis ke
`publish/out/connections.json` dan nama akun muncul di kolom **Link** dashboard.

---

## 6. Kalau macet

| Gejala | Sebab yang paling sering |
|---|---|
| `redirect_uri_mismatch` (Google) | URL di console beda dengan `http://127.0.0.1:4173/callback`, atau port server berubah |
| `URL Blocked` (Meta) | Valid OAuth Redirect URIs belum diisi, atau app masih Development dan akunmu bukan tester |
| Google tidak memberi refresh token | app lama masih punya izin; cabut di [myaccount.google.com](https://myaccount.google.com/permissions) lalu connect lagi |
| `invalid_grant` di doctor | refresh token Google mati (7 hari di mode Testing) — connect ulang |
| `(#10) Application does not have permission` | `instagram_content_publish` belum disetujui, atau IG bukan Professional |
| `(#100) ... does not exist` | `IG_USER_ID` bukan `instagram_business_account.id` — pilih ulang Page di `/connect` |
| `(#200) Requires pages_manage_posts` | token bukan Page token, atau izin tidak dicentang saat Allow |
| TikTok `scope_not_authorized` | `video.publish` belum disetujui untuk app |
| TikTok `unaudited_client_can_only_post_to_private_accounts` | normal; app belum audit |
| TikTok `invalid_grant` | refresh token dipakai dua kali (mis. dua proses posting bersamaan) — connect ulang |
| X `403` | plan tidak punya write, atau token mati dan refresh gagal |
| X `401` | client secret salah untuk app tipe Web, atau `offline.access` tidak diminta |
| Kartu tetap `NEEDS APP` | salah satu field kosong; isi dua-duanya lalu **save app** |

---

## 7. Yang masih manual (jujur)

- **Membuat app.** Tidak ada API untuk membuat developer app; ini selalu manual.
- **App Review / audit.** TikTok dan Meta membatasi app yang belum diaudit. Itu
  keputusan platform, bukan tool.
- **Adapter belum diuji ke akun asli.** Run pertama tiap platform harus video
  privat / `SELF_ONLY`.
- **Instagram resumable upload** adalah jalur paling belum terverifikasi; kalau
  gagal, unggah manual dulu.
- **Port berubah.** Kalau 4173 dipakai, server pindah port dan callback-nya ikut
  berubah — daftarkan URL yang muncul di kartu, atau hentikan proses yang
  memakai 4173 (`lsof -ti:4173 | xargs kill`).
