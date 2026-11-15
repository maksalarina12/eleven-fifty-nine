# THE LAST MESSAGE — S01 + S02

Folder ini berisi dua puluh episode vertikal (9:16) plus halaman pemutar client-side.

## Isi

| File | Durasi | Resolusi | Catatan |
|---|---|---|---|
| `THE_LAST_MESSAGE_Part1.mp4` | 60,0 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part2.mp4` | 45,3 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part3.mp4` | 43,5 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part4.mp4` | 60,5 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part5.mp4` | 67,3 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part6.mp4` | 83,2 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part7.mp4` | 73,7 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part8.mp4` | 77,6 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part9.mp4` | 94,4 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part10.mp4` | 124,4 s | 1080×1920 | H.264 + AAC 48 kHz — finale S01 |
| `THE_LAST_MESSAGE_S02E01.mp4` | 42,7 s | 1080×1920 | H.264 + AAC 48 kHz — The Eden Signal |
| `THE_LAST_MESSAGE_S02E02.mp4` | 42,1 s | 1080×1920 | H.264 + AAC 48 kHz — The Empty City |
| `THE_LAST_MESSAGE_S02E03.mp4` | 47,8 s | 1080×1920 | H.264 + AAC 48 kHz — The Archive |
| `THE_LAST_MESSAGE_S02E04.mp4` | 44,0 s | 1080×1920 | H.264 + AAC 48 kHz — The False Memory |
| `THE_LAST_MESSAGE_S02E05.mp4` | 41,0 s | 1080×1920 | H.264 + AAC 48 kHz — The Witness |
| `THE_LAST_MESSAGE_S02E06.mp4` | 40,7 s | 1080×1920 | H.264 + AAC 48 kHz — The Divide |
| `THE_LAST_MESSAGE_S02E07.mp4` | 41,0 s | 1080×1920 | H.264 + AAC 48 kHz — The Source |
| `THE_LAST_MESSAGE_S02E08.mp4` | 39,3 s | 1080×1920 | H.264 + AAC 48 kHz — The Awakening |
| `THE_LAST_MESSAGE_S02E09.mp4` | 43,8 s | 1080×1920 | H.264 + AAC 48 kHz — The Eden Protocol |
| `THE_LAST_MESSAGE_S02E10.mp4` | 46,9 s | 1080×1920 | H.264 + AAC 48 kHz — The Other Side |
| `poster1.jpg` … `poster20.jpg` | — | 1080×1920 | thumbnail untuk halaman |
| `index.html` | — | — | pemutar + daftar part (100% client-side) |

## Cara buka

Klik dua kali `index.html`, atau:

```bash
xdg-open index.html
```

Tidak butuh server. Video dan poster dimuat dari folder yang sama, jadi
`index.html` harus tetap berada satu folder dengan kedua puluh MP4.

## Kontrol

- `Space` play / pause
- `←` / `→` mundur / maju 5 detik
- `1` … `9` pindah part, `0` untuk Part 10 (Season 1)
- Season 2 dipilih dari daftar di kanan pemutar (Part 11–20)
- `F` fullscreen, `M` mute
- Setiap part otomatis lanjut ke part berikutnya saat habis

## Sumber

Kode & bahan animasi (Remotion, audio asli, storyboard) ada di folder induk
dari `HASIL` ini — lihat `../README.md` untuk struktur dan cara render ulang.

## Catatan produksi

- Narasi memakai audio asli (`vo.mp3`, `pt2.mp3` … `pt10.mp3`) tanpa re-record,
  tanpa stretch, tanpa ketukan tambahan.
- Tanpa subtitle dan tanpa title card.
- Part 4 ke atas memakai penanda waktu hasil forced alignment (Whisper base.en)
  plus `silencedetect`, bukan estimasi editorial, sehingga potongan jatuh tepat
  di kata yang diucapkan. Grid Part 6 dihitung dari durasi audio sebenarnya
  (83,226 s), bukan angka 84,478 s di storyboard; Part 7–10 juga (73,72 s,
  77,64 s, 94,35 s, 124,45 s).
- Scar di atas/melewati alis kiri Noah terlihat di kesepuluh episode.
- Semua episode memakai watermark kecil `EldraMyth` di kanan atas, sesuai brief;
  teks antarmuka lain sengaja dihilangkan.
- Teks di layar Part 5 persis seperti brief: `145`, `146`, `147`,
  `SUBJECT 001`, `STATUS: TERMINATED`, dan `Find the room where you were born.`
- Teks di layar Part 6 persis seperti brief: `11:59`, `12:00 AM`,
  `SUBJECT 002`, dan `DON'T TRUST NOAH.`, ditambah baris diegetik
  `Find the room where you were born.` di ponsel Noah yang memang diminta
  storyboard.
- Part 7–10 hanya menampilkan teks yang hidup di dalam dunia cerita: layar
  ponsel, label monitor, jam, dan dinding (`MESSAGES`, `SUBJECT 002`,
  `He remembers you.`, `You were never Subject 002.`,
  `You were the one who created it.`, `THE FIRST EXPERIMENT`, `PROJECT ORIGIN`,
  `MEMORY SYNCHRONIZATION INITIATED`, `ACCESS DENIED`, `11:59 PM` / `12:00 AM`,
  `Thank you for remembering me.`, koordinat `35.6812° N / 139.7671° E`,
  `PROJECT EDEN`).
- Part 10 ditutup kartu `NOAH AND AMARA / WILL COME BACK / — SEASON 2` di dalam
  hitam, setelah ruangan padam; watermark disembunyikan di kartu itu.
- Part 1–7 ditutup tail hitam; Part 8–10 memudar ke hitam di dalam kata terakhir.
- Season 2 memakai kontrak model-agnostik: jumlah frame = `floor(durasi MP3 × 30)`
  dari audio yang benar-benar ada di `public/audio/`, dan setiap potongan jatuh di
  kata hasil Whisper `base.en` — bukan di timestamp bible. `npm run lock` memeriksa
  itu sebelum render; `S02ENN.audio.json` menyimpan voice, durasi, jumlah frame,
  dan sha256 MP3 supaya hasilnya bisa direproduksi dengan model suara apa pun.
- Teks di layar Season 2 hanya: `11:59`, `12:01`, `SUBJECT 001`, `SUBJECT 002`,
  `DR. ELIAS`, `DON'T TRUST NOAH.`, `You have already been here.`,
  `Emotional attachment trial: successful.`, `Phase 3 is waiting.`, plus baris
  diegetik `Find the room where you were born.` di ponsel Noah. Tidak ada subtitle,
  tidak ada title card, tidak ada label season di layar.
