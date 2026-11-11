# Kaitkan akun (YouTube, TikTok, Instagram, Facebook, X)

Tidak ada satu tombol "login semua". Setiap platform hanya mengizinkan upload
lewat **developer app** milikmu sendiri, dengan izin (scope) yang disetujui
pemilik akun. Jadi "kaitkan akun" = bikin app sekali, lalu ambil kredensial dan
tempel ke `.env`.

Yang perlu kamu siapkan dan apa yang realistis:

| Platform | Yang dibuat | Scope utama | Umur token | Cocok manual? |
|---|---|---|---|---|
| YouTube | Google Cloud project + OAuth client (Desktop) | `youtube.upload` (+ `youtube.readonly`) | refresh token permanen* | Ya |
| Instagram + Facebook | Satu Meta app + Page | `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `pages_manage_posts` | Page token panjang (~60 hari, bisa diperpanjang) | Ya |
| TikTok | TikTok developer app + Content Posting API | `video.publish`, `user.info.basic` | access ~24 jam, refresh ~1 tahun | Tidak nyaman |
| X | X developer app (OAuth 2.0) | `tweet.write`, `media.write`, `users.read`, `offline.access` | access 2 jam, refresh tersedia | Tidak nyaman |

\* Refresh token Google bisa mati dalam 7 hari kalau consent screen masih
berstatus **Testing** dan user type **External** — lihat catatan di bagian
YouTube.

Urutan yang paling masuk akal: **YouTube → Meta (IG+FB) → TikTok → X.**
YouTube paling sederhana dan tokennya paling tahan lama. TikTok dan X tokennya
berumur pendek, jadi tunda sampai tool punya auto-refresh (belum ada, lihat
bagian terakhir).

---

## 0. Sebelum mulai

- Akun YouTube, Instagram, Facebook Page, TikTok, dan X harus akun yang benar-benar kamu kelola.
- Instagram harus **Professional** (Creator/Business) dan terhubung ke sebuah Facebook Page.
- Jangan pernah commit `.env`. File itu sudah berisi token setara password.
- Setelah setiap platform selesai, jalankan `npm run doctor` untuk memastikan token benar-benar menunjuk ke akun yang tepat.

Format `.env` ada di `publish/.env.example`. Salin dulu:

```bash
cp publish/.env.example .env
```

---

## 1. YouTube (paling gampang)

1. Buka [console.cloud.google.com](https://console.cloud.google.com/), buat project baru (nama bebas).
2. **APIs & Services → Library** → cari **YouTube Data API v3** → Enable.
3. **APIs & Services → OAuth consent screen**:
   - User type: **External**
   - Isi nama app, email support, email developer.
   - **Test users**: tambahkan email Google yang punya channel YouTube-mu.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Desktop app**
   - Simpan **Client ID** dan **Client secret**.
5. Ambil refresh token lewat [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/):
   - Klik ikon gear kanan atas → centang **Use your own OAuth credentials** → tempel Client ID + secret.
   - Di Step 1, isi scope (dua-duanya, dipisah spasi):
     `https://www.googleapis.com/auth/youtube.upload`
     `https://www.googleapis.com/auth/youtube.readonly`
   - **Authorize APIs** → login dengan akun channel → **Exchange authorization code for tokens**.
   - Copy **Refresh token**.
6. Isi `.env`:

```bash
YT_CLIENT_ID=....apps.googleusercontent.com
YT_CLIENT_SECRET=...
YT_REFRESH_TOKEN=...
YT_PRIVACY=private
YT_CATEGORY=24
```

7. Cek: `npm run doctor` → harus muncul nama channel-mu.

**Catatan penting soal umur token.** Kalau consent screen masih **Testing**,
Google menerbitkan refresh token yang kedaluwarsa dalam **7 hari**. Pilihan:

- ulangi langkah 5 seminggu sekali (2 menit), atau
- ajukan verifikasi app (scope `youtube.upload` tergolong sensitif; butuh privacy policy + video demo), atau
- kalau akunnya Google Workspace, set User type **Internal** — tidak perlu verifikasi dan tidak ada batas 7 hari.

Tool akan melaporkan `invalid_grant` di `npm run doctor` kalau token sudah mati;
itu tandanya tinggal ambil refresh token baru.

---

## 2. Instagram Reels + Facebook Reels (satu Meta app)

Keduanya memakai app yang sama. Instagram memakai **Page token**, bukan token
user biasa.

1. Pastikan Instagram sudah **Professional** dan terhubung ke Facebook Page:
   Instagram app → Settings → Account type and tools → Switch to professional account,
   lalu hubungkan ke Page lewat Meta Business Suite.
2. Buka [developers.facebook.com](https://developers.facebook.com/) → **Create app** → tipe **Business**.
3. Di app, tambahkan produk **Facebook Login for Business** (dan **Instagram** bila tersedia di menu).
4. Buka **App settings → Basic**, catat **App ID** dan **App secret**. Di **App roles**, pastikan akunmu adalah Admin/Tester.
5. Ambil token lewat [Graph API Explorer](https://developers.facebook.com/tools/explorer/):
   - Pilih app-mu.
   - Tambahkan permissions: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`.
   - **Generate Access Token** → login → izinkan semua.
6. Tukar jadi **long-lived user token** (60 hari):

```bash
curl "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

7. Ambil Page token dan Instagram ID:

```bash
# daftar Page + token
curl "https://graph.facebook.com/v21.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"

# cari IG professional account yang terhubung ke Page
curl "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=PAGE_TOKEN"
```

8. Isi `.env` (IG memakai Page token yang sama):

```bash
FB_PAGE_ID=...
FB_PAGE_TOKEN=...          # token Page dari /me/accounts
IG_USER_ID=...             # instagram_business_account.id
IG_ACCESS_TOKEN=...        # Page token yang sama
```

9. Cek: `npm run doctor` → harus muncul nama Page dan `@username` Instagram.

**Selama app masih Development mode**, token hanya bekerja untuk admin/tester
app — cukup untuk akunmu sendiri. App Review baru perlu kalau orang lain mau
memakai tool ini.

**Instagram dan Facebook tidak punya draft.** Begitu `post.mjs --yes` dijalankan,
Reels langsung tayang. Uji dulu dengan video pendek.

---

## 3. TikTok

Ini yang paling ketat. App yang belum diaudit **hanya bisa posting privat**
(`SELF_ONLY`), dan hanya ke akun tester yang kamu tambahkan sendiri.

1. Daftar di [developers.tiktok.com](https://developers.tiktok.com/) → **Manage apps** → buat app.
2. Tambahkan produk **Login Kit** dan **Content Posting API**.
3. Di pengaturan Content Posting API, aktifkan **Direct Post**.
4. Minta scope `video.publish` (dan `user.info.basic`) untuk app-mu. Tanpa scope ini upload akan ditolak.
5. Daftarkan **Redirect URI** (wajib, dan harus persis sama saat authorize). Untuk desktop, TikTok memakai `https://www.tiktok.com/v2/auth/authorize/`.
6. Tambahkan akun TikTok-mu sebagai **test user** di app (Sandbox), lalu lakukan OAuth Login Kit untuk mendapatkan **access token** dan **refresh token**.
7. Isi `.env`:

```bash
TIKTOK_ACCESS_TOKEN=...
TIKTOK_PRIVACY=SELF_ONLY
```

8. Cek: `npm run doctor` → harus muncul `@username` TikTok.

**Batasan yang perlu kamu tahu:**

- Access token TikTok berumur pendek (sekitar 24 jam) dan harus di-refresh memakai refresh token. Tool ini **belum** menyimpan/memakai refresh token, jadi untuk sekarang kamu perlu ambil access token baru setiap kali mau posting.
- App yang belum lolos audit tidak bisa posting publik, walaupun `TIKTOK_PRIVACY` diubah. Itu keputusan TikTok, bukan setelan tool.
- Untuk posting publik rutin, ajukan audit Content Posting API.

---

## 4. X (Twitter)

1. Daftar [developer.x.com](https://developer.x.com/) dan pastikan plan-mu mengizinkan **write** (posting). Plan gratis punya batas ketat; media upload bisa tidak tersedia tergantung plan — cek dashboard developer.
2. Buat app → **User authentication settings** → enable **OAuth 2.0**.
3. Isi:
   - Type of App: **Native App** (public client, PKCE) atau **Web App** (confidential, ada client secret)
   - Callback URI: harus persis sama dengan yang kamu pakai (mis. `http://127.0.0.1:4173/callback`)
   - Website URL: boleh link apa saja milikmu
4. Scopes: `tweet.read`, `tweet.write`, `users.read`, `media.write`, `offline.access`.
5. Lakukan OAuth 2.0 Authorization Code + PKCE, lalu isi:

```bash
X_ACCESS_TOKEN=...
```

6. Cek: `npm run doctor` → harus muncul `@username`.

**Batasan:** access token X hanya berlaku **2 jam**. Supaya tetap jalan, app harus
memakai refresh token (`offline.access`). Tool ini belum melakukan refresh
otomatis, jadi token statis di `.env` akan mati cepat. Jangan repot-repot mengisi
X sebelum bagian terakhir di bawah dikerjakan.

---

## 5. Cek koneksi

```bash
npm run doctor
```

Atau dari dashboard: tombol **check links** di kanan atas. Hasilnya juga
ditulis ke `publish/out/connections.json` dan nama akun muncul di kolom **Link**
pada tabel platform.

Contoh saat belum ada kredensial:

```
PLATFORM        STATUS    ACCOUNT          DETAIL
YouTube         —         not configured   missing YT_CLIENT_ID, ...
X               FAILED                     403 Forbidden
0/5 linked · 1 failed
```

`FAILED` berarti kredensial ada tapi ditolak (token salah, kedaluwarsa, atau
scope kurang). `—` berarti memang belum diisi.

---

## 6. Kalau macet

| Gejala | Sebab yang paling sering |
|---|---|
| YouTube `invalid_grant` | refresh token kedaluwarsa (7 hari di mode Testing) atau scope kurang |
| YouTube `403` saat cek nama channel | token hanya punya `youtube.upload`; tambahkan `youtube.readonly` |
| Instagram `(#10) Application does not have permission` | app belum punya `instagram_content_publish`, atau akun bukan Professional |
| Instagram `(#100) ... does not exist` | `IG_USER_ID` salah — pakai `instagram_business_account.id`, bukan username |
| Facebook `(#200) Requires pages_manage_posts` | token bukan Page token, atau izin belum disetujui saat generate token |
| TikTok `scope_not_authorized` | `video.publish` belum disetujui untuk app |
| TikTok `unaudited_client_can_only_post_to_private_accounts` | normal; app belum audit |
| X `403` | plan tidak punya write, atau token kedaluwarsa (2 jam) |
| X `401` | token bukan user token OAuth 2.0, atau scope `tweet.write` tidak ada |

---

## 7. Yang belum ada di tool ini

Supaya jelas, ini batasnya sekarang:

- **Belum ada halaman "Login" OAuth.** Kredensial diambil manual seperti di atas.
- **Belum ada auto-refresh** untuk X (2 jam) dan TikTok (24 jam). YouTube dan Meta sudah aman karena tokennya panjang.
- **Adapter belum diuji ke akun asli.** Run pertama tiap platform harus video privat/`SELF_ONLY`.
- **Instagram resumable upload** adalah jalur paling belum terverifikasi; kalau gagal, unggah manual dulu.

Kalau mau, langkah berikutnya yang paling berguna adalah **wizard koneksi**:
satu halaman di dashboard dengan tombol *Login with Google / Meta / TikTok / X*,
callback lokal, token disimpan ke `.env`, plus auto-refresh untuk X dan TikTok.
Itu menghapus semua langkah copy-paste di atas. Yang tetap harus kamu lakukan
hanya membuat app dan mengisi Client ID/Secret sekali — platform tidak
mengizinkan cara lain.
