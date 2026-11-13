# THE LAST MESSAGE — S01

Folder ini berisi enam episode vertikal (9:16) plus halaman pemutar client-side.

## Isi

| File | Durasi | Resolusi | Catatan |
|---|---|---|---|
| `THE_LAST_MESSAGE_Part1.mp4` | 60,0 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part2.mp4` | 45,3 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part3.mp4` | 43,5 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part4.mp4` | 60,5 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part5.mp4` | 67,3 s | 1080×1920 | H.264 + AAC 48 kHz |
| `THE_LAST_MESSAGE_Part6.mp4` | 83,2 s | 1080×1920 | H.264 + AAC 48 kHz — finale |
| `poster1.jpg` … `poster6.jpg` | — | 1080×1920 | thumbnail untuk halaman |
| `index.html` | — | — | pemutar + daftar part (100% client-side) |

## Cara buka

Klik dua kali `index.html`, atau:

```bash
xdg-open index.html
```

Tidak butuh server. Video dan poster dimuat dari folder yang sama, jadi
`index.html` harus tetap berada satu folder dengan keenam MP4.

## Kontrol

- `Space` play / pause
- `←` / `→` mundur / maju 5 detik
- `1` … `6` pindah part
- `F` fullscreen, `M` mute
- Setiap part otomatis lanjut ke part berikutnya saat habis

## Sumber

Kode & bahan animasi (Remotion, audio asli, storyboard) ada di folder induk
dari `HASIL` ini — lihat `../README.md` untuk struktur dan cara render ulang.

## Catatan produksi

- Narasi memakai audio asli (`vo.mp3`, `pt2.mp3`, `pt3.mp3`, `pt 4.mp3`,
  `pt5.mp3`, `pt6.mp3`) tanpa re-record, tanpa stretch, tanpa ketukan tambahan.
- Tanpa subtitle dan tanpa title card.
- Part 4, Part 5 dan Part 6 memakai penanda waktu hasil forced alignment (Whisper
  base.en) plus `silencedetect`, bukan estimasi editorial, sehingga potongan
  jatuh tepat di kata yang diucapkan. Grid Part 6 dihitung dari durasi audio
  sebenarnya (83,226 s), bukan angka 84,478 s di storyboard.
- Scar di atas/melewati alis kiri Noah terlihat di keenam episode.
- Part 5 (dan episode lain) memakai watermark kecil `EldraMyth` di kanan atas,
  sesuai brief; teks antarmuka lain sengaja dihilangkan.
- Semua teks di layar Part 5 persis seperti brief: `145`, `146`, `147`,
  `SUBJECT 001`, `STATUS: TERMINATED`, dan `Find the room where you were born.`
- Semua teks di layar Part 6 persis seperti brief: `11:59`, `12:00 AM`,
  `SUBJECT 002`, dan `DON'T TRUST NOAH.`, ditambah baris diegetik
  `Find the room where you were born.` di ponsel Noah yang memang diminta
  storyboard.
